using FluentValidation;
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services;
using Geesemon.Web.Services.ChatActionsSubscription;
using Geesemon.Web.Services.MessageSubscription;
using GraphQL;
using GraphQL.Types;
using System;

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
            FileManagerService fileManagerService
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

                    var chat = await chatManager.GetByUsernameAsync(sentMessageInput.ChatUsername, currentUserId);
                    if (!chat.UserChats.Any(uc => uc.UserId == currentUserId))
                        throw new ExecutionError("User can sent messages only to chats that he participate.");

                    Message? replyMessage = null;
                    if(sentMessageInput.ReplyMessageId != null)
                    {
                        replyMessage = await messageManager.GetByIdAsync(sentMessageInput.ReplyMessageId);
                        if (replyMessage.ChatId != chat.Id)
                            throw new ExecutionError("User can reply messages only from one chat");
                    }

                    if(sentMessageInput.Files.Count() > 0)
                    {
                        var newMessages = new List<Message>();
                        await Parallel.ForEachAsync(sentMessageInput.Files, async (file, token) =>
                        {
                            var fileUrl = await fileManagerService.UploadFileAsync(FileManagerService.FilesFolder, file);
                            Message newMessage = new Message()
                            {
                                ChatId = chat.Id,
                                Text = sentMessageInput.Files.Count() == newMessages.Count - 1 ? sentMessageInput.Text : null,
                                FromId = currentUserId,
                                Type = MessageKind.Regular,
                                ReplyMessageId = replyMessage?.Id,
                                FileUrl = fileUrl,
                            };
                            newMessages.Add(newMessage);
                        });
                        await Parallel.ForEachAsync(newMessages, async (message, token) =>
                        {
                            message = await messageManager.CreateAsync(message);
                            messageActionSubscriptionService.Notify(message, MessageActionKind.Create);
                        });
                        return newMessages;
                    }
                    else
                    {
                        Message newMessage = new Message()
                        {
                            ChatId = chat.Id,
                            Text = sentMessageInput.Text,
                            FromId = currentUserId,
                            Type = MessageKind.Regular,
                            ReplyMessageId = replyMessage?.Id,
                        };
                        newMessage = await messageManager.CreateAsync(newMessage);
                        messageActionSubscriptionService.Notify(newMessage, MessageActionKind.Create);
                        return new List<Message> { newMessage };
                    }
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<MessageType, Message>()
                .Name("Delete")
                .Argument<NonNullGraphType<DeleteMessageInputType>, DeleteMessageInput>("Input", "")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteMessageInput>("Input");
                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

                    var message = await messageManager.GetByIdAsync(input.MessageId);

                    if (message == null)
                        throw new Exception("Message not found.");

                    var chat = await chatManager.GetByIdAsync(message.ChatId);
                    if (message.FromId != currentUserId)
                        if (!await chatManager.IsUserInChat(currentUserId, message.ChatId) || chat.Type != ChatKind.Personal)
                            throw new Exception("User can't delete other user's messages.");

                    await messageManager.RemoveAsync(message.Id);

                    return messageActionSubscriptionService.Notify(message, MessageActionKind.Delete);
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

                    if(!await chatManager.IsUserInChat(currentUserId, message.ChatId))
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

