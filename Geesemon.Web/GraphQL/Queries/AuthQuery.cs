using EducationalPortal.Server.Services;
using Geesemon.DataAccess.Managers;
using Geesemon.DomainModel.Models;
using Geesemon.DomainModel.Models.Auth;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types;
using GraphQL;
using GraphQL.Types;
using Microsoft.Net.Http.Headers;

namespace Geesemon.Web.GraphQL.Queries.Auth
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
                    string userLogin = httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultLoginClaimType).Value;
                    User currentUser = await userManager.GetByLoginAsync(userLogin);

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
                .AuthorizeWithPolicy(AuthPolicies.Authenticated);
        }
    }
}
