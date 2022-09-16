using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services;
using GraphQL;
using GraphQL.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;

namespace Geesemon.Web.GraphQL.Mutations
{
    public class AuthMutation : ObjectGraphType
    {
        public AuthMutation(AuthService authService, UserManager userManager, ChatManager chatManager, UserChatManager userChatManager, AccessTokenManager accessTokenManager, IHttpContextAccessor httpContextAccessor)
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

                    var accessToken = new AccessToken
                    {
                        Token = authService.GenerateAccessToken(newUser.Id, newUser.Email, newUser.Role),
                        UserId = newUser.Id,
                    };
                    accessToken = await accessTokenManager.CreateAsync(accessToken);

                    return new AuthResponse()
                    {
                        Token = accessToken.Token,
                        User = newUser,
                    };
                });

            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Login")
                .Argument<NonNullGraphType<LoginInputType>, LoginInput>("input", "Argument to login User")
                .ResolveAsync(async context =>
                {
                    var loginInput = context.GetArgument<LoginInput>("input");
                    var user = await userManager.GetByLoginAsync(loginInput.Login);

                    if (user == null)
                        throw new Exception("Login or password not valid.");

                    var saltedPassword = loginInput.Password + user.Id;
                    if (user.Password != saltedPassword.CreateMD5())
                        throw new Exception("Login or password not valid.");

                    var accessToken = new AccessToken
                    {
                        Token = authService.GenerateAccessToken(user.Id, user.Login, user.Role),
                        UserId = user.Id,
                    };
                    accessToken = await accessTokenManager.CreateAsync(accessToken);

                    return new AuthResponse()
                    {
                        Token = accessToken.Token,
                        User = user,
                    };
                });

            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("Logout")
                .ResolveAsync(async context =>
                {
                    var userId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    var token = httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization];
                    await accessTokenManager.RemoveAsync(userId, token);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
