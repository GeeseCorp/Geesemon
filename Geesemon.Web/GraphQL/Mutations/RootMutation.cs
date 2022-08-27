using Geesemon.Web.GraphQL.Mutations.Auth;
using Geesemon.Web.GraphQL.Mutations.Messages;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations
{
    public class RootMutation : ObjectGraphType
    {
        public RootMutation()
        {
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
