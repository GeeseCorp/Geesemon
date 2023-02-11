using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.Utils.SettingsAccess;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MyCSharp.HttpUserAgentParser;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Geesemon.Web.Services;

public class AuthService
{
    private readonly ISettingsProvider settingsProvider;
    private readonly IHttpContextAccessor httpContextAccessor;

    public AuthService(ISettingsProvider settingsProvider, IHttpContextAccessor httpContextAccessor)
    {
        this.settingsProvider = settingsProvider;
        this.httpContextAccessor = httpContextAccessor;
    }

    public const string Bearer = "Bearer";

    public string GenerateAccessToken(Guid userId, string userIdentifier, UserRole userRole)
    {
        SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settingsProvider.GetAuthIssuerSigningKey()));
        SigningCredentials signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new List<Claim>
        {
            new Claim(AuthClaimsIdentity.DefaultIdClaimType, userId.ToString()),
            new Claim(AuthClaimsIdentity.DefaultIdentifierClaimType, userIdentifier),
            new Claim(ClaimsIdentity.DefaultRoleClaimType, userRole.ToString()),
        };
        JwtSecurityToken token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(30),
                signingCredentials: signingCredentials);
        return Bearer + " " + new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal ValidateAccessToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(settingsProvider.GetAuthIssuerSigningKey());
            tokenHandler.ValidateToken(CleanBearerInToken(token), new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
            }, out var validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;

            ClaimsIdentity claimsIdentity = new ClaimsIdentity(jwtToken.Claims, JwtBearerDefaults.AuthenticationScheme);

            return new ClaimsPrincipal(claimsIdentity);
        }
        catch
        {
            return null;
        }
    }

    public string GenerateLoginToken()
    {
        SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settingsProvider.GetAuthIssuerSigningKey()));
        SigningCredentials signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new JwtSecurityToken(
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: signingCredentials);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal ValidateLoginToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(settingsProvider.GetAuthIssuerSigningKey());
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
            }, out var validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;

            ClaimsIdentity claimsIdentity = new ClaimsIdentity(jwtToken.Claims, JwtBearerDefaults.AuthenticationScheme);

            return new ClaimsPrincipal(claimsIdentity);
        }
        catch
        {
            return null;
        }
    }

    public string? CleanBearerInToken(string token)
    {
        return token?.Replace(Bearer + " ", string.Empty);
    }

    public async Task<Session> FillSession(Session session, bool isOnline)
    {
        var ipAddress = httpContextAccessor.HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        string? location;
        if (ipAddress == "127.0.0.1" || ipAddress == "0.0.0.1")
        {
            location = "-, -";
        }
        else
        {
            try
            {
                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("apikey", "kKeJir32sWslTj4Oav624x0APp9avBRO");
                var result = await client.GetAsync($"https://api.apilayer.com/ip_to_location/{ipAddress}");
                dynamic response = JsonConvert.DeserializeObject(await result.Content.ReadAsStringAsync());
                location = $"{response.region_name}, {response.country_name}";
            }
            catch
            {
                location = "-, -";
            }
        }
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
