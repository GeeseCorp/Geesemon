using Geesemon.DomainModel.Models.Auth;
using Geesemon.Web.GraphQL.Types.Message;
using Geesemon.Web.Model;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations.Messages
{
    public class ChatMutation : ObjectGraphType<object>
    {
        public ChatMutation(IChat chat)
        {
            Field<MessageType>("addMessage",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<MessageInputType>> { Name = "message" }
                ),
                resolve: context =>
                {
                    var receivedMessage = context.GetArgument<ReceivedMessage>("message");
                    var message = chat.AddMessage(receivedMessage);
                    return message;
                })
                .AuthorizeWithPolicy(AuthPolicies.Authenticated); 
        }
    }
}

public class MessageInputType : InputObjectGraphType
{
    public MessageInputType()
    {
        Field<NonNullGraphType<StringGraphType>>("content");
        Field<NonNullGraphType<DateGraphType>>("sentAt");
        Field<NonNullGraphType<StringGraphType>>("toId");
    }
}
