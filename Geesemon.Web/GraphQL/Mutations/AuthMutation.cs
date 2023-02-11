using FluentValidation;
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services;
using Geesemon.Web.Services.ChatActivitySubscription;
using Geesemon.Web.Services.LoginViaTokenSubscription;
using GraphQL;
using GraphQL.Types;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using System.Text;

namespace Geesemon.Web.GraphQL.Mutations
{
    public class AuthMutation : ObjectGraphType
    {
        public AuthMutation(
            AuthService authService,
            UserManager userManager,
            SessionManager sessionManager,
            FileManagerService fileManagerService,
            IHttpContextAccessor httpContextAccessor,
            IValidator<AuthLoginInput> authLoginInputValidator,
            IValidator<AuthRegisterInput> authRegisterInputValidator,
            IValidator<AuthUpdateProfile> authUpdateProfileValidator,
            IChatActivitySubscriptionService chatActivitySubscriptionService,
            ILoginViaTokenSubscriptionService loginViaTokenSubscriptionService
            )
        {
            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Register")
                .Argument<NonNullGraphType<AuthRegisterInputType>, AuthRegisterInput>("input", "Argument to register new User")
                .ResolveAsync(async context =>
                {
                    var authRegisterInput = context.GetArgument<AuthRegisterInput>("input");
                    authRegisterInputValidator.ValidateAndThrow(authRegisterInput);

                    var user = await userManager.GetByIdentifierAsync(authRegisterInput.Identifier);
                    if (user != null)
                        throw new Exception($"User with login '{authRegisterInput.Identifier}' already exist.");

                    user = await userManager.GetByEmailAsync(authRegisterInput.Email);

                    if (user != null)
                        throw new Exception($"User with email '{authRegisterInput.Email}' already exist.");

                    var userId = Guid.NewGuid();
                    var saltedPassword = authRegisterInput.Password + userId;
                    var newUser = await userManager.CreateAsync(new User
                    {
                        Id = userId,
                        Identifier = authRegisterInput.Identifier,
                        Password = saltedPassword.CreateMD5(),
                        FirstName = authRegisterInput.FirstName,
                        LastName = authRegisterInput.LastName,
                        Email = authRegisterInput.Email,
                        Role = UserRole.User,
                    });

                    var session = new Session
                    {
                        Token = authService.GenerateAccessToken(newUser.Id, newUser.Identifier, newUser.Role),
                        UserId = newUser.Id,
                    };
                    session = await authService.FillSession(session, true);
                    session = await sessionManager.CreateAsync(session);

                    return new AuthResponse()
                    {
                        Token = session.Token,
                        User = newUser,
                    };
                });

            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("Login")
                .Argument<NonNullGraphType<AuthLoginInputType>, AuthLoginInput>("input", "Argument to login User")
                .ResolveAsync(async context =>
                {
                    var authLoginInput = context.GetArgument<AuthLoginInput>("input");
                    authLoginInputValidator.ValidateAndThrow(authLoginInput);

                    var user = await userManager.GetByIdentifierAsync(authLoginInput.Identifier);
                    if (user == null)
                        throw new Exception("Login or password not valid.");

                    var saltedPassword = authLoginInput.Password + user.Id;
                    if (user.Password != saltedPassword.CreateMD5())
                        throw new Exception("Login or password not valid.");

                    var session = new Session
                    {
                        Token = authService.GenerateAccessToken(user.Id, user.Identifier, user.Role),
                        UserId = user.Id,
                    };
                    session = await authService.FillSession(session, true);
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
                    var userId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

                    var session = await sessionManager.GetByTokenAsync(token);
                    session = await authService.FillSession(session, isOnline);
                    await sessionManager.UpdateAsync(session);

                    await chatActivitySubscriptionService.Notify(userId);
                    return true;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<SessionType>, Session>()
                .Name("TerminateSession")
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

            Field<NonNullGraphType<ListGraphType<SessionType>>, IEnumerable<Session>>()
                .Name("TerminateAllOtherSessions")
                .ResolveAsync(async context =>
                {
                    var userId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    string token = httpContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization];
                    return await sessionManager.TerminateAllOthersSessionAsync(userId, token);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<UserType>, User>()
                .Name("UpdateProfile")
                .Argument<NonNullGraphType<AuthUpdateProfileType>, AuthUpdateProfile>("Input", "")
                .ResolveAsync(async context =>
                {
                    var authUpdateProfile = context.GetArgument<AuthUpdateProfile>("Input");
                    await authUpdateProfileValidator.ValidateAndThrowAsync(authUpdateProfile);

                    string imageUrl;
                    if (authUpdateProfile.Image != null)
                        imageUrl = await fileManagerService.UploadFileAsync(FileManagerService.UsersAvatarsFolder, authUpdateProfile.Image);
                    else
                        imageUrl = authUpdateProfile.ImageUrl;

                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    var currentUser = await userManager.GetByIdAsync(currentUserId);
                    currentUser.FirstName = authUpdateProfile.Firstname;
                    currentUser.LastName = authUpdateProfile.Lastname;
                    currentUser.Identifier = authUpdateProfile.Identifier;
                    currentUser.ImageUrl = imageUrl;
                    currentUser = await userManager.UpdateAsync(currentUser);

                    await chatActivitySubscriptionService.Notify(currentUser.Id);
                    return currentUser;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<AuthGenerateLoginQrCodeType>, AuthGenerateLoginQrCode>()
                .Name("GenerateLoginQrCode")
                .ResolveAsync(async context =>
                {
                    var token = authService.GenerateLoginToken();
                    var json = string.Format(
                        @"{{""data"":""{0}"",""config"":{{""body"":""round"",""eye"":""frame13"",""eyeBall"":""ball15"",""erf1"":[],""erf2"":[],""erf3"":[],""brf1"":[],""brf2"":[],""brf3"":[],""bodyColor"":""#000000"",""bgColor"":""#FFFFFF"",""eye1Color"":""#000000"",""eye2Color"":""#000000"",""eye3Color"":""#000000"",""eyeBall1Color"":""#000000"",""eyeBall2Color"":""#000000"",""eyeBall3Color"":""#000000"",""gradientColor1"":"""",""gradientColor2"":"""",""gradientType"":""linear"",""gradientOnEyes"":""true"",""logo"":""940099f5a274eb8c265745d4d4afe9c74786e7b1.svg"",""logoMode"":""clean""}},""size"":1000,""download"":""imageUrl"",""file"":""svg""}}",
                        token);
                    var data = new StringContent(json, Encoding.UTF8, "application/json");
                    var response = await new HttpClient().PostAsync("https://api.qrcode-monkey.com//qr/custom", data);
                    var generateQrCodeResponse = JsonConvert.DeserializeObject<GenerateQrCodeResponse>(await response.Content.ReadAsStringAsync());
                    return new AuthGenerateLoginQrCode
                    {
                        QrCodeUrl = "https://" + generateQrCodeResponse.ImageUrl.Substring(2),
                        Token = token,
                    };
                });

            Field<NonNullGraphType<AuthResponseType>, AuthResponse>()
                .Name("LoginViaToken")
                .Argument<NonNullGraphType<StringGraphType>>("token", "")
                .ResolveAsync(async context =>
                {
                    var token = context.GetArgument<string>("token");
                    var result = authService.ValidateLoginToken(token);

                    if (result == null)
                        throw new ExecutionError("Token is not valid");

                    var identifier = httpContextAccessor.HttpContext.User.Claims.GetIdentifier();
                    var user = await userManager.GetByIdentifierAsync(identifier);
                    if (user == null)
                        throw new Exception("User does not exists.");

                    var session = new Session
                    {
                        Token = authService.GenerateAccessToken(user.Id, user.Identifier, user.Role),
                        UserId = user.Id,
                    };
                    session = await authService.FillSession(session, true);
                    session = await sessionManager.CreateAsync(session);

                    var authResponse = new AuthResponse()
                    {
                        Token = session.Token,
                        User = user,
                    };
                    loginViaTokenSubscriptionService.Notify(new LoginViaToken
                    {
                        Token = token,
                        AuthResponse = authResponse,
                    });

                    return authResponse;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }

        class GenerateQrCodeResponse
        {
            public string ImageUrl { get; set; }
        }
    }
}
