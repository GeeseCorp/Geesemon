using Geesemon.DataAccess.Managers;
using Geesemon.DomainModel.Models;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations.UserMutations
{
    public class UserMutation : ObjectGraphType
    {
        public UserMutation(IServiceProvider serviceProvider)
        {
            Field<UserType, User>()
                .Name("Save")
                .Argument<UserInputType>("UserInput", "User input for creating new user.")
                .ResolveAsync(async context => 
                {
                    var userManager = context.RequestServices.GetRequiredService<UserManager>();
                    var userInp = context.GetArgument<User>("UserInput");
                    return await userManager.CreateAsync(userInp);
                });

            Field<UserType, User>()
                .Name("Delete")
                .Argument<GuidGraphType>("Id", "Id of user to be deleted.")
                .ResolveAsync(async context => 
                {
                    var userManager = context.RequestServices.GetRequiredService<UserManager>();
                    var userId = context.GetArgument<Guid>("Id");
                    return await userManager.RemoveAsync(userId);
                });
        }
    }
}
