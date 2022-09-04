using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.Extensions;
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

                    User user = await userManager.GetByLoginAsync(loginInput.Login);

                    if (user != null)
                        throw new Exception($"User with login '{loginInput.Login}' already exist.");

                    user = await userManager.GetByEmailAsync(loginInput.Email);

                    if (user != null)
                        throw new Exception($"User with email '{loginInput.Email}' already exist.");

                    var userId = Guid.NewGuid();
                    var saltedPassword = loginInput.Password + userId;
                    var newUser = await userManager.CreateAsync(new User
                    {
                        Id = userId,
                        Login = loginInput.Login,
                        Password = saltedPassword.CreateMD5(),
                        FirstName = loginInput.FirstName,
                        LastName = loginInput.LastName,
                        Email = loginInput.Email,
                        Role = UserRole.User,
                    });

                    var savedChat = new Chat
                    {
                        CreatorId = newUser.Id,
                        Type = ChatKind.Saved,
                        Id = newUser.Id,
                    };
                    savedChat = await chatManager.CreateAsync(savedChat);

                    var userChat = new List<UserChat>(){
                        new UserChat { UserId = newUser.Id, ChatId = savedChat.Id },
                    };
                    await userChatManager.CreateManyAsync(userChat);

                    return new AuthResponse()
                    {
                        Token = authService.GenerateAccessToken(newUser.Id, newUser.Login, newUser.Role),
                        User = newUser,
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
