using Geesemon.DataAccess.Data;
using Geesemon.DataAccess.Managers;
using Geesemon.DomainModel.Models.Auth;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Queris.UserQueries
{
    public class UserQuery : ObjectGraphType
    {
        public UserQuery(IUserProvider userData, UserManager userManager)
        {
            Field<ListGraphType<UserType>, List<UserModel>>()
                .Name("GetAll")
                .ResolveAsync(async ctx => await userManager.GetAsync())
                .AuthorizeWithPolicy(AuthPolicies.Authenticated);

            Field<UserType, UserModel>()
                .Name("Get")
                .Argument<GuidGraphType>("UserId")
                .ResolveAsync(async ctx => (await userData.GetByIdAsync(ctx.GetArgument<Guid>("UserId"))))
                .AuthorizeWithPolicy(AuthPolicies.Authenticated);
        }
    }
}
