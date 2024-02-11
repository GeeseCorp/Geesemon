using Geesemon.DataAccess.Dapper.Providers;
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;

using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Queries
{
    public class UserQuery : ObjectGraphType
    {
        public UserQuery(UserManager userManager, IHttpContextAccessor httpContextAccessor, UserProvider userProvider)
        {
            Field<NonNullGraphType<ListGraphType<UserType>>, List<User>>()
                .Name("Get")
                .Argument<UserGetInputType, UserGetInput>("Input", "")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<UserGetInput>("Input");
                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    return await userProvider.GetAsync(input.Take, input.Skip, input.Query, currentUserId);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<UserType, User>()
                .Name("GetById")
                .Argument<GuidGraphType>("UserId")
                .ResolveAsync(async context =>
                {
                    return await userManager.GetByIdAsync(context.GetArgument<Guid>("UserId"));
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<ListGraphType<UserType>>, IEnumerable<User>>()
                .Name("GetReadBy")
                .Argument<NonNullGraphType<GuidGraphType>, Guid>("MessageId", "")
                .Argument<NonNullGraphType<IntGraphType>, int>("Skip", "")
                .Argument<IntGraphType, int?>("Take", "")
                .ResolveAsync(async context =>
                {
                    var skip = context.GetArgument<int>("Skip");
                    var take = context.GetArgument<int?>("Take");
                    var messageId = context.GetArgument<Guid>("MessageId");
                    return await userManager.GetReadByAsync(messageId, skip, take ?? 30);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
