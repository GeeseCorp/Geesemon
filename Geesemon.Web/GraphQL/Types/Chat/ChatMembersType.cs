using Geesemon.Model.Models;
using Geesemon.Web.Services.ChatActionsSubscription;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class ChatMembersType : ObjectGraphType<ChatMembers>
{
    public ChatMembersType()
    {
        Field<NonNullGraphType<ChatMembersKindType>, ChatMembersKind>()
            .Name("Type")
            .Resolve(context => context.Source.Type);

        Field<NonNullGraphType<UserType>, User>()
            .Name("User")
            .Resolve(context => context.Source.User);
    }
}
