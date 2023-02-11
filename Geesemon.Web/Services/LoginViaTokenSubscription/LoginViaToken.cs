using Geesemon.Web.GraphQL.Types;
using GraphQL.Types;

namespace Geesemon.Web.Services.LoginViaTokenSubscription;

public class LoginViaTokenType : ObjectGraphType<LoginViaToken>
{
    public LoginViaTokenType()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Token")
            .Resolve(context => context.Source.Token);

        Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
            .Name("AuthResponse")
            .Resolve(context => context.Source.AuthResponse);
    }
}

public class LoginViaToken
{
    public string Token { get; set; }

    public AuthResponse AuthResponse { get; set; }
}
