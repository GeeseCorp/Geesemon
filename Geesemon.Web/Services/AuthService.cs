using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Utils.SettingsAccess;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Geesemon.Web.Services;

public class AuthService
{
    private readonly ISettingsProvider settingsProvider;

    public AuthService(ISettingsProvider settingsProvider)
    {
        this.settingsProvider = settingsProvider;
    }

    public const string Bearer = "Bearer";

    public string GenerateAccessToken(Guid userId, string userLogin, UserRole userRole)
    {
        SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settingsProvider.GetAuthIssuerSigningKey()));
        SigningCredentials signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = new List<Claim>
        {
            new Claim(AuthClaimsIdentity.DefaultIdClaimType, userId.ToString()),
            new Claim(AuthClaimsIdentity.DefaultLoginClaimType, userLogin),
            new Claim(ClaimsIdentity.DefaultRoleClaimType, userRole.ToString()),
        };
        JwtSecurityToken token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(30),
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

    public string? CleanBearerInToken(string token)
    {
        return token?.Replace(Bearer + " ", string.Empty);
    }

}
