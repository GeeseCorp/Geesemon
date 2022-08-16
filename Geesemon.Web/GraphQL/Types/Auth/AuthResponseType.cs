using Geesemon.DomainModel.Models;
using Geesemon.Model.Models;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types.Auth
{
    public class AuthResponseType : ObjectGraphType<AuthResponse>
    {
        public AuthResponseType()
        {
            Field<NonNullGraphType<UserType>, UserModel>()
                .Name("User")
                .Resolve(context => context.Source.User);

            Field<NonNullGraphType<StringGraphType>, string>()
                .Name("Token")
                .Resolve(context => context.Source.Token);
        }
    }
}
