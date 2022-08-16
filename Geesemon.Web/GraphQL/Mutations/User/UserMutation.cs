using Geesemon.DataAccess.Managers;
using Geesemon.DomainModel.Models;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.GraphQL.Types.InputTypes;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations.UserMutations
{
    public class UserMutation : ObjectGraphType
    {
        public UserMutation(UserManager userManager)
        {
            Field<UserType, UserModel>()
                .Name("Save")
                .Argument<UserInputType>("UserInput", "User input for creating new user.")
                .ResolveAsync(async ctx => {
                        var userInp = ctx.GetArgument<UserModel>("UserInput");
                        return await userManager.CreateAsync(userInp);
                    });

            Field<UserType, UserModel>()
                .Name("Delete")
                .Argument<GuidGraphType>("Id", "Id of user to be deleted.")
                .ResolveAsync(async ctx => {
                    var userId = ctx.GetArgument<Guid>("Id");
                    return await userManager.RemoveAsync(userId);
                });
        }
    }
}
