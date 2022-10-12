using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
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
            ReadMessagesManager readMessagesManager
            )
        {
            Field<MessageType>()
                .Name("Send")
                .Argument<NonNullGraphType<SentMessageInputType>, SentMessageInput>("Input", "")
                .ResolveAsync(async context =>
                    {
                        var sentMessageInput = context.GetArgument<SentMessageInput>("Input");
                        var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

                        var chat = await chatManager.GetByUsername(sentMessageInput.ChatUsername, currentUserId);
                        if(chat == null)
                            throw new ExecutionError("Chat not found");

                        var isUserInChat = await chatManager.IsUserInChat(currentUserId, chat.Id);
                        if (!isUserInChat)
                            throw new ExecutionError("User can sent messages only to chats that he participate.");

                        Message newMessage = new Message()
                        {
                            ChatId = chat.Id,
                            Text = sentMessageInput.Text,
                            FromId = currentUserId,
                            Type = MessageKind.Regular
                        };

                        newMessage = await messageManager.CreateAsync(newMessage);

                        return messageActionSubscriptionService.Notify(newMessage, MessageActionKind.Create);
                    })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<MessageType>()
                .Name("Delete")
                .Argument<NonNullGraphType<DeleteMessageInputType>, DeleteMessageInput>("Input", "")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<DeleteMessageInput>("Input");
                    var currentUserId = httpContextAccessor?.HttpContext?.User.Claims.GetUserId();

                    var message = await messageManager.GetByIdAsync(input.MessageId);

                    if (message == null)
                        throw new Exception("Message not found.");

                    if (message.FromId != currentUserId)
                        throw new Exception("User can't delete other user's messages.");

                    await messageManager.RemoveAsync(message.Id);

                    return messageActionSubscriptionService.Notify(message, MessageActionKind.Delete);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<MessageType>()
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
                    return messageActionSubscriptionService.Notify(message, MessageActionKind.Update);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}

