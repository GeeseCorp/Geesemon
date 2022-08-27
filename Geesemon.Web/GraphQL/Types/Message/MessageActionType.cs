using Geesemon.Model.Models;
using Geesemon.Web.Services.MessageSubscription;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class MessageActionType : ObjectGraphType<MessageAction>
{
    public MessageActionType()
    {
        Field<MessegeActionKindType, MessageActionKind>()
            .Name("Type");

        Field<MessageType, Message>()
            .Name("Message");
    }
}
