using EducationalPortal.Server.Services;
using Geesemon.DataAccess.Managers;
using Geesemon.DomainModel.Models;
using Geesemon.DomainModel.Models.Auth;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Queries.Auth
{
    public class ChatQuery : ObjectGraphType
    {
        public ChatQuery(IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<ListGraphType<ChatType>>, List<Chat>>()
                .Name("Get")
                .ResolveAsync(async context =>
                {
                    var chatManager = context.RequestServices.GetRequiredService<ChatManager>();
                    var currentUserId = httpContextAccessor?.HttpContext?.User.Claims?.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType)?.Value;

                    return await chatManager.GetAsync(Guid.Parse(currentUserId));
                })
                .AuthorizeWithPolicy(AuthPolicies.Authenticated);
        }
    }
}
