using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services;
using GraphQL;
using GraphQL.Types;
using System.Drawing;

namespace Geesemon.Web.GraphQL.Mutations
{
    public class AuthMutation : ObjectGraphType
    {
        public readonly List<string> colors = new List<string>() { "#1abc9c", "#2ecc71", "#3498db", "#9b59b6",
                                                                    "#16a085", "#27ae60", "#2980b9", "#8e44ad",
                                                                    "#f1c40f", "#e67e22", "#e74c3c", "#f39c12",
                                                                    "#d35400", "#c0392b", "#6ab04c", "#be2edd"};

        public AuthMutation(AuthService authService, UserManager userManager, ChatManager chatManager, UserChatManager userChatManager)
        {
            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Register")
                .Argument<NonNullGraphType<RegisterInputType>, RegisterInput>("input", "Argument to register new User")
                .ResolveAsync(async context =>
                {
                    var rnd = new Random();
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
                        AvatarColor = colors[rnd.Next(0, colors.Count - 1)]
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
