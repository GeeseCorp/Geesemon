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
        public MessageMutation(IMessagerSubscriptionService subscriptionService,
            IHttpContextAccessor httpContextAccessor)
        {
            Field<MessageType>()
                .Name("Sent")
                .Argument<NonNullGraphType<MessageInputType>>("Message")
                .ResolveAsync(async context =>
                    {
                        var receivedMessage = context.GetArgument<ReceivedMessage>("message");
                        var currentUserId = httpContextAccessor?.HttpContext?.User.Claims.GetUserId();

                        Message newMessage = new Message()
                        {
                            ChatId = receivedMessage.ChatId,
                            Text = receivedMessage.Text,
                            FromId = currentUserId,
                            Type = MessageKind.Regular
                        };
                        var messageManager = context.RequestServices.GetRequiredService<MessageManager>();
                        newMessage = await messageManager.CreateAsync(newMessage);

                        return subscriptionService.SendAction(newMessage);
                    })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}

public class MessageInputType : InputObjectGraphType<ReceivedMessage>
{
    public MessageInputType()
    {
        Field<NonNullGraphType<GuidGraphType>>("chatId");
        Field<NonNullGraphType<StringGraphType>>("text");
    }
}
