using FluentValidation;
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Common;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services.FileManagers;
using Geesemon.Web.Services.MessageSubscription;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations
{
    public class MessageMutation : ObjectGraphType<object>
    {
        public MessageMutation(
            IMessageActionSubscriptionService messageActionSubscriptionService,
            IHttpContextAccessor httpContextAccessor,
            MessageManager messageManager,
            ChatManager chatManager,
            ReadMessagesManager readMessagesManager,
            IValidator<SentMessageInput> sentMessageInputValidator,
            IValidator<DeleteMessageInput> deleteMessageInputValidator,
            IFileManagerService fileManagerService
            )
        {
            Field<NonNullGraphType<ListGraphType<MessageType>>, IEnumerable<Message>>()
                .Name("Send")
                .Argument<NonNullGraphType<SentMessageInputType>, SentMessageInput>("Input", "")
                .ResolveAsync(async context =>
                {
                    var sentMessageInput = context.GetArgument<SentMessageInput>("Input");
                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    await sentMessageInputValidator.ValidateAndThrowAsync(sentMessageInput);

                    var chat = await chatManager.GetByIdentifierAsync(sentMessageInput.Identifier, currentUserId);
                    if (!chat.UserChats.Any(uc => uc.UserId == currentUserId))
                        throw new ExecutionError("User can sent messages only to chats that he participate.");

                    Message? replyMessage = null;
                    if (sentMessageInput.ReplyMessageId != null)
                    {
                        replyMessage = await messageManager.GetByIdAsync(sentMessageInput.ReplyMessageId);
                        if (replyMessage.ChatId != chat.Id)
                            throw new ExecutionError("User can reply messages only from one chat");
                    }

                    var newMessages = new List<Message>();

                    if (sentMessageInput.Files != null && sentMessageInput.Files.Count() > 0)
                    {
                        foreach (var file in sentMessageInput.Files)
                        {
                            var fileUrl = await fileManagerService.UploadFileAsync(FileManagerConstants.FilesFolder, file);
                            var newMessage = new Message()
                            {
                                ChatId = chat.Id,
                                Text = sentMessageInput.Files.Count() == newMessages.Count - 1 ? sentMessageInput.Text : null,
                                FromId = currentUserId,
                                ReplyMessageId = replyMessage?.Id,
                                FileUrl = fileUrl,
                                MediaKind = sentMessageInput.MediaKind,
                                MimeType = file.ContentType,
                            };
                            newMessages.Add(newMessage);
                        }
                    }

                    if (sentMessageInput.ForwardedMessageIds != null && sentMessageInput.ForwardedMessageIds.Count() > 0)
                    {
                        if (newMessages.Count == 0 && !string.IsNullOrEmpty(sentMessageInput.Text))
                        {
                            var newMessage = new Message()
                            {
                                ChatId = chat.Id,
                                Text = sentMessageInput.Text,
                                FromId = currentUserId,
                                ReplyMessageId = replyMessage?.Id,
                            };
                            newMessages.Add(newMessage);
                        }

                        foreach (var forwardedMessageId in sentMessageInput.ForwardedMessageIds)
                        {
                            var message = await messageManager.GetByIdAsync(forwardedMessageId);
                            var newMessage = new Message()
                            {
                                ChatId = chat.Id,
                                FromId = currentUserId,
                                ReplyMessageId = replyMessage?.Id,
                                ForwardedMessage = ForwardedMessage.GetForwardedMessage(message),
                            };
                            newMessages.Add(newMessage);
                        }
                    }

                    if (newMessages.Count == 0)
                    {
                        if (string.IsNullOrEmpty(sentMessageInput.Text))
                            throw new ExecutionError("Message text can not be empty");

                        Message newMessage = new Message()
                        {
                            ChatId = chat.Id,
                            Text = sentMessageInput.Text,
                            FromId = currentUserId,
                            ReplyMessageId = replyMessage?.Id,
                        };
                        newMessages.Add(newMessage);
                    }

                    var createdMessages = new List<Message>();
                    foreach (var newMessage in newMessages)
                    {
                        var createdMessage = await messageManager.CreateAsync(newMessage);
                        messageActionSubscriptionService.Notify(createdMessage, MessageActionKind.Create);
                        createdMessages.Add(createdMessage);
                    }

                    return createdMessages;

                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<ListGraphType<MessageType>, IEnumerable<Message>>()
                .Name("Delete")
                .Argument<NonNullGraphType<DeleteMessageInputType>, DeleteMessageInput>("Input", "")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteMessageInput>("Input");
                    await deleteMessageInputValidator.ValidateAndThrowAsync(input);

                    var deletedMessages = new List<Message>();
                    foreach (var messageId in input.MessageIds)
                    {
                        var deletedMessage = await messageManager.GetByIdAsync(messageId);
                        await messageManager.RemoveAsync(deletedMessage);
                        deletedMessages.Add(deletedMessage);
                    }

                    foreach (var deletedMessage in deletedMessages)
                    {
                        messageActionSubscriptionService.Notify(deletedMessage, MessageActionKind.Delete);
                    }

                    return deletedMessages;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<MessageType, Message>()
                .Name("Update")
                .Argument<NonNullGraphType<UpdateMessageInputType>, UpdateMessageInput>("Input", "")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<UpdateMessageInput>("Input");
                    var currentUserId = httpContextAccessor?.HttpContext?.User.Claims.GetUserId();

                    var message = await messageManager.GetByIdAsync(input.MessageId);

                    if (message == null)
                        throw new Exception("Message not found.");

                    if (message.FromId != currentUserId)
                        throw new Exception("User can't update other user's messages.");

                    if (message.ForwardedMessage != null)
                        throw new Exception("You can not update forwarded messages.");

                    message.Text = input.Text;
                    message.IsEdited = true;

                    await messageManager.UpdateAsync(message);

                    return messageActionSubscriptionService.Notify(message, MessageActionKind.Update);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<MessageType>, Message>()
                .Name("MakeRead")
                .Argument<NonNullGraphType<GuidGraphType>, Guid>("MessageId", "")
                .ResolveAsync(async context =>
                {
                    var messageId = context.GetArgument<Guid>("MessageId");
                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

                    var message = await messageManager.GetByIdAsync(messageId);
                    if (message == null)
                        throw new ExecutionError("Message not found.");

                    if (message.FromId == currentUserId)
                        throw new ExecutionError("You can not read your message");

                    if (!await chatManager.IsUserInChat(currentUserId, message.ChatId))
                        throw new ExecutionError("You can not read messages which is not in your chats");

                    await readMessagesManager.CreateAsync(new ReadMessage
                    {
                        CreatedAt = DateTime.UtcNow,
                        MessageId = messageId,
                        ReadById = currentUserId,
                    });
                    messageActionSubscriptionService.Notify(message, MessageActionKind.Update);

                    //var chat = await chatManager.GetByIdAsync(message.ChatId);
                    //var userChats = await userChatManager.Get(chat.Id);
                    //chatActionSubscriptionService.Notify(chat, ChatActionKind.Update, userChats.Select(uc => uc.UserId));

                    return message;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}

