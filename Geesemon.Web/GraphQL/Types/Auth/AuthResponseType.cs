using Geesemon.Model.Models;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class AuthResponseType : ObjectGraphType<AuthResponse>
    {
        public AuthResponseType()
        {
            Field<NonNullGraphType<UserType>, User>()
                .Name("User")
                .Resolve(context => context.Source.User);

            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("Token")
                .Resolve(context => context.Source.Token);
        }
    }
}
