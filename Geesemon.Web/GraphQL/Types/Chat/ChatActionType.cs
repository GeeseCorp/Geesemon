using Geesemon.Model.Models;
using Geesemon.Web.Services.ChatActionsSubscription;
using Geesemon.Web.Services.MessageSubscription;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class ChatActionType : ObjectGraphType<ChatAction>
{
    public ChatActionType()
    {
        Field<ChatActionKindType, ChatActionKind>()
            .Name("Type");

        Field<ChatType, Chat>()
            .Name("Chat");
    }
}
