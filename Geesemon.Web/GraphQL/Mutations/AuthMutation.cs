﻿using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services;
using Geesemon.Web.Services.ChatActivitySubscription;
using GraphQL;
using GraphQL.Types;
using Microsoft.Net.Http.Headers;
using MyCSharp.HttpUserAgentParser;
using Newtonsoft.Json;

namespace Geesemon.Web.GraphQL.Mutations
{
    public class AuthMutation : ObjectGraphType
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public AuthMutation(
            AuthService authService,
            UserManager userManager,
            ChatManager chatManager, 
            UserChatManager userChatManager,
            SessionManager sessionManager, 
            IHttpContextAccessor httpContextAccessor,
            IServiceProvider serviceProvider
            )
        {
            this.httpContextAccessor = httpContextAccessor;

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

                    var userChat = new List<UserChat>
                    {
                        new UserChat { UserId = newUser.Id, ChatId = savedChat.Id },
                    };
                    await userChatManager.CreateManyAsync(userChat);

                    var session = new Session
                    {
                        Token = authService.GenerateAccessToken(user.Id, user.Email, user.Role),
                        UserId = user.Id,
                    };
                    session = await FillSession(session, true);
                    session = await sessionManager.CreateAsync(session);

                    return new AuthResponse()
                    {
                        Token = session.Token,
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

                    var session = new Session
                    {
                        Token = authService.GenerateAccessToken(user.Id, user.Login, user.Role),
                        UserId = user.Id,
                    };
                    session = await FillSession(session, true);
                    session = await sessionManager.CreateAsync(session);

                    return new AuthResponse()
                    {
                        Token = session.Token,
                        User = user,
                    };
                });

            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("Logout")
                .ResolveAsync(async context =>
                {
                    var userId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    var token = httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization];
                    await sessionManager.RemoveAsync(userId, token);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("ToggleOnline")
                .Argument<NonNullGraphType<BooleanGraphType>, bool>("IsOnline", "")
                .ResolveAsync(async context =>
                {
                    var isOnline = context.GetArgument<bool>("IsOnline");
                    var token = httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization];
                    var session = await sessionManager.GetByTokenAsync(token);
                    session = await FillSession(session, isOnline);
                    await sessionManager.UpdateAsync(session);
                    var userId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    using var scope = serviceProvider.CreateScope();
                    var chatActivitySubscriptionService = scope.ServiceProvider.GetRequiredService<IChatActivitySubscriptionService>();
                    await chatActivitySubscriptionService.Notify(userId);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
            
            Field<NonNullGraphType<SessionType>, Session>()
                .Name("RemoveSession")
                .Argument<NonNullGraphType<GuidGraphType>, Guid>("SessionId", "")
                .ResolveAsync(async context =>
                {
                    var sessionId = context.GetArgument<Guid>("SessionId");
                    var session = await sessionManager.GetByIdAsync(sessionId);
                    var userId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    if (session.UserId != userId)
                        throw new ExecutionError("You can not remove others sessions");
                    return await sessionManager.RemoveAsync(session);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }


        private async Task<Session> FillSession(Session session, bool isOnline)
        {
            var ipAddress = httpContextAccessor.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("apikey", "kKeJir32sWslTj4Oav624x0APp9avBRO");
            var result = await client.GetAsync($"https://api.apilayer.com/ip_to_location/{ipAddress}");
            dynamic response = JsonConvert.DeserializeObject(await result.Content.ReadAsStringAsync());
            var location = $"{response.region_name}, {response.country_name}";
            var userAgentString = httpContextAccessor.HttpContext.Request.Headers["User-Agent"].ToString();
            var userAgent = HttpUserAgentParser.Parse(userAgentString);
            session.LastTimeOnline = DateTime.UtcNow;
            session.IsOnline = isOnline;
            session.IpAddress = ipAddress;
            session.UserAgent = $"{userAgent.Name}, {userAgent.Platform.Value.Name}";
            session.Location = location;
            return session;
        }
    }
}
