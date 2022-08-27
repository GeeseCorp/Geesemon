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
        public AuthQuery(IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Me")
                .ResolveAsync(async context =>
                {
                    var userManager = context.RequestServices.GetRequiredService<UserManager>();
                    var userLogin = httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultLoginClaimType).Value;
                    var currentUser = await userManager.GetByLoginAsync(userLogin);

                    if (currentUser == null)
                        return new AuthResponse();

                    var token = httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization]
                    .ToString()
                    .Replace("Bearer ", string.Empty);
                    return new AuthResponse()
                    {
                        Token = token,
                        User = currentUser,
                    };
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
