using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations
{
    public class AuthMutation : ObjectGraphType
    {
        public AuthMutation(AuthService authService, UserManager userManager, ChatManager chatManager, UserChatManager userChatManager)
        {
            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Register")
                .Argument<NonNullGraphType<RegisterInputType>, RegisterInput>("input", "Argument to register new User")
                .ResolveAsync(async context =>
                {
                    var loginInput = context.GetArgument<RegisterInput>("input");
                    var user = await userManager.CreateAsync(new User
                    {
                        Login = loginInput.Login,
                        Password = loginInput.Password,
                        FirstName = loginInput.FirstName,
                        LastName = loginInput.LastName,
                        Email = loginInput.Email,
                        Role = UserRole.User,
                    });

                    var savedChat = new Chat
                    {
                        CreatorId = user.Id,
                        Type = ChatKind.Saved,
                        Id = user.Id,
                    };
                    savedChat = await chatManager.CreateAsync(savedChat);

                    var userChat = new List<UserChat>(){
                        new UserChat { UserId = user.Id, ChatId = savedChat.Id },
                    };
                    await userChatManager.CreateManyAsync(userChat);

                    return new AuthResponse()
                    {
                        Token = authService.GenerateAccessToken(user.Id, user.Login, user.Role),
                        User = user,
                    };
                });

            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Login")
                .Argument<NonNullGraphType<LoginInputType>, LoginInput>("input", "Argument to login User")
                .ResolveAsync(async context =>
                {
                    var loginInput = context.GetArgument<LoginInput>("input");

                    return await authService.AuthenticateAsync(loginInput);
                });
        }
    }
}
