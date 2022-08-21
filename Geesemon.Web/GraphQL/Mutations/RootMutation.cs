using Geesemon.Web.GraphQL.Mutations.Auth;
using Geesemon.Web.GraphQL.Mutations.Messages;
using Geesemon.Web.GraphQL.Mutations.UserMutations;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations
{
    public class RootMutation : ObjectGraphType
    {
        public RootMutation()
        {
            Field<UserMutation>()
                .Name("User")
                .Resolve(_ => new { });

            Field<AuthMutation>()
                .Name("Auth")
                .Resolve(_ => new { });

            Field<ChatMutation>()
                .Name("Chat")
                .Resolve(_ => new { });

            Field<MessageMutation>()
                .Name("Message")
                .Resolve(_ => new { });
        }

    }
}
