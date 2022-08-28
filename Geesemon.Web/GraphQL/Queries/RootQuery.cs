using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Queries
{
    public class RootQuery : ObjectGraphType
    {
        public RootQuery()
        {
            Field<UserQuery>()
                .Name("User")
                .Resolve(_ => new { });

            Field<AuthQuery>()
                .Name("Auth")
                .Resolve(_ => new { });

            Field<ChatQuery>()
                .Name("Chat")
                .Resolve(_ => new { });
            
            Field<MessageQuery>()
                .Name("Message")
                .Resolve(_ => new { });
        }

    }
}
