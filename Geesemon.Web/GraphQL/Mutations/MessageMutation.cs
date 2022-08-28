using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services.MessageSubscription;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations
{
    public class MessageMutation : ObjectGraphType<object>
    {
        public MessageMutation(IMessageActionSubscriptionService subscriptionService,
            IHttpContextAccessor httpContextAccessor, MessageManager messageManager)
        {
            Field<MessageType>()
                .Name("Send")
                .Argument<NonNullGraphType<SentMessageInputType>>("Input")
                .ResolveAsync(async context =>
                    {
                        var receivedMessage = context.GetArgument<SentMessageInput>("Input");
                        var currentUserId = httpContextAccessor?.HttpContext?.User.Claims.GetUserId();

                        Message newMessage = new Message()
                        {
                            ChatId = receivedMessage.ChatId,
                            Text = receivedMessage.Text,
                            FromId = currentUserId,
                            Type = MessageKind.Regular
                        };

                        newMessage = await messageManager.CreateAsync(newMessage);

                        return subscriptionService.Notify(newMessage, MessageActionKind.Create);
                    })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<MessageType>()
                .Name("Delete")
                .Argument<NonNullGraphType<DeleteMessageInputType>>("Input")
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

                    return subscriptionService.Notify(message, MessageActionKind.Delete);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<MessageType>()
                .Name("Update")
                .Argument<NonNullGraphType<UpdateMessageInputType>>("Input")
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

                    return subscriptionService.Notify(message, MessageActionKind.Update);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}

