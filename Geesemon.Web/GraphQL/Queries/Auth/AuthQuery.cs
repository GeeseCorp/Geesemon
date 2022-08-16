using EducationalPortal.Server.Services;
using Geesemon.DataAccess.Managers;
using Geesemon.DomainModel.Models;
using Geesemon.DomainModel.Models.Auth;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types.Auth;
using GraphQL;
using GraphQL.Types;
using Microsoft.Net.Http.Headers;

namespace Geesemon.Web.GraphQL.Queries.Auth
{
    public class AuthQuery : ObjectGraphType
    {
        public AuthQuery(UserManager usersManager, IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Me")
                .ResolveAsync(async context =>
                {
                    string userLogin = httpContextAccessor.HttpContext.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultLoginClaimType).Value;
                    UserModel currentUser = await usersManager.GetByLoginAsync(userLogin);

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
