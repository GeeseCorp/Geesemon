using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Encodings.Web;
using System.Text;
using Geesemon.Web.Utils.SettingsAccess;
using Geesemon.DataAccess.Managers;
using Geesemon.Web.Services;

namespace Geesemon.Web.Middlewares;

public class BasicAuthenticationOptions : AuthenticationSchemeOptions
{
}

public class BasicAuthenticationHandler : AuthenticationHandler<BasicAuthenticationOptions>
{
    public const string SchemeName = "GeesemonSchemeName";
    private readonly AccessTokenManager accessTokenManager;
    private readonly ISettingsProvider settingsProvider;
    private readonly AuthService authService;

    public BasicAuthenticationHandler(
        IOptionsMonitor<BasicAuthenticationOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        AccessTokenManager accessTokenManager,
        ISettingsProvider settingsProvider,
        AuthService authService) : base(options, logger, encoder, clock)
    {
        this.accessTokenManager = accessTokenManager;
        this.settingsProvider = settingsProvider;
        this.authService = authService;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        string token = Request.Headers[HeaderNames.Authorization];
        var handler = new JwtSecurityTokenHandler();
        var validations = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settingsProvider.GetAuthIssuerSigningKey())),
            ValidateIssuer = false,
            ValidateAudience = false
        };
        try
        {
            var claimsPrincipal = handler.ValidateToken(authService.CleanBearerInToken(token), validations, out var tokenSecure);
            var userId = claimsPrincipal.Claims.GetUserId();
            var tokens = await accessTokenManager.GetAsync(t => t.UserId == userId);
            if (!tokens.Any(t => t.Token == token))
                throw new Exception("Bad token");
            var ticket = new AuthenticationTicket(claimsPrincipal, new AuthenticationProperties { IsPersistent = false }, SchemeName);
            return AuthenticateResult.Success(ticket);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return AuthenticateResult.Fail(ex);
        }
    }
}
