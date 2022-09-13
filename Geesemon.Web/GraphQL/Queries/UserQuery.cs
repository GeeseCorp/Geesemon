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
        public UserQuery(UserManager userManager)
        {
            Field<NonNullGraphType<ListGraphType<UserType>>, List<User>>()
                .Name("Get")
                .Argument<UserGetInputType, UserGetInput>("Input", "")
                .ResolveAsync(async context =>
                {
                    var input = context.GetArgument<UserGetInput>("Input");
                    return await userManager.GetAsync(input.Take, input.Skip, input.Q);
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
        }
    }
}
