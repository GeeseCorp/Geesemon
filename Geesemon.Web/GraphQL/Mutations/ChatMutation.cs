using Geesemon.DomainModel.Models.Auth;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types.Message;
using Geesemon.Web.Model;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations.Messages
{
    public class ChatMutation : ObjectGraphType<object>
    {
        public ChatMutation(IChat chat, IHttpContextAccessor httpContextAccessor)
        {
            Field<MessageType>("addMessage",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<MessageInputType>> { Name = "message" }
                ),
                resolve: context =>
                {
                    var receivedMessage = context.GetArgument<ReceivedMessage>("message");
                    var currentUserId = httpContextAccessor?.HttpContext?.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value;

                    Message newMessage = new Message()
                    {
                        ChatId = receivedMessage.ChatId,
                        Text = receivedMessage.Text,
                        FromId = Guid.Parse(currentUserId),
                        Type = MessageKind.Regular
                    };
                    var message = chat.AddMessage(newMessage);
                    return message;
                })
                .AuthorizeWithPolicy(AuthPolicies.Authenticated); 
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
