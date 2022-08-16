using Geesemon.Web.GraphQL.Queries.Auth;
using Geesemon.Web.GraphQL.Queris.UserQueries;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Queris
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
        }

    }
}
