using Geesemon.DataAccess.Managers;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using GraphQL;
using GraphQL.Types;
using Microsoft.Net.Http.Headers;

namespace Geesemon.Web.GraphQL.Queries
{
    public class AuthQuery : ObjectGraphType
    {
        public AuthQuery(IHttpContextAccessor httpContextAccessor, UserManager userManager)
        {
            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Me")
                .ResolveAsync(async context =>
                {
                    var userId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    return new AuthResponse()
                    {
                        Token = httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization],
                        User = await userManager.GetByIdAsync(userId),
                    };
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
