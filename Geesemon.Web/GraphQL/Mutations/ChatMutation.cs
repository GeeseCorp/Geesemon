using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations.Messages
{
    public class ChatMutation : ObjectGraphType<object>
    {
        public ChatMutation(IHttpContextAccessor httpContextAccessor)
        {
            //Field<ChatType, Chat>()
            //    .Name("CreatePersonal")
            //    .Argument<ChatInputType>("UserInput", "User input for creating new user.")
            //    .ResolveAsync(async context =>
            //    {
            //        var userManager = context.RequestServices.GetRequiredService<UserManager>();
            //        var userInp = context.GetArgument<User>("UserInput");
            //        return await userManager.CreateAsync(userInp);
            //    });

        }
    }
}
