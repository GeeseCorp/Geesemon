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
        public UserQuery()
        {
            Field<ListGraphType<UserType>, List<User>>()
                .Name("GetAll")
                .ResolveAsync(async context =>
                {
                    var userManager = context.RequestServices.GetRequiredService<UserManager>();
                    return await userManager.GetAsync();
                })
                .AuthorizeWithPolicy(AuthPolicies.Authenticated);

            Field<UserType, User>()
                .Name("Get")
                .Argument<GuidGraphType>("UserId")
                .ResolveAsync(async context => 
                {
                    var userManager = context.RequestServices.GetRequiredService<UserManager>();
                    return await userManager.GetByIdAsync(context.GetArgument<Guid>("UserId"));
                })
                .AuthorizeWithPolicy(AuthPolicies.Authenticated);
        }
    }
}
