﻿using Geesemon.DataAccess.Managers;
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
    private readonly IServiceProvider serviceProvider;

    private readonly ISettingsProvider settingsProvider;
    private readonly IHttpContextAccessor httpContextAccessor;

    public AuthService(IServiceProvider serviceProvider, ISettingsProvider settingsProvider,
        IHttpContextAccessor httpContextAccessor)
    {
        this.serviceProvider = serviceProvider;
        this.settingsProvider = settingsProvider;
        this.httpContextAccessor = httpContextAccessor;
    }

    public async Task<AuthResponse> AuthenticateAsync(LoginInput loginAuthInput)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
        var user = await userManager.GetByLoginAsync(loginAuthInput.Login);

        if(user == null)
            throw new Exception("Login or password not valid.");

        var saltedPassword = loginAuthInput.Password + user.Id;


        if (user.Password != saltedPassword.CreateMD5())
            throw new Exception("Login or password not valid.");

        var token = GenerateAccessToken(user.Id, user.Login, user.Role);

        return new AuthResponse() { Token = token, User = user };
    }

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
            issuer: settingsProvider.GetAuthValidIssuer(),
            audience: settingsProvider.GetAuthValidAudience(),
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: signingCredentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public ClaimsPrincipal ValidateJWTToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(settingsProvider.GetAuthIssuerSigningKey());
            tokenHandler.ValidateToken(CleanJWTToken(token), new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidIssuer = settingsProvider.GetAuthValidIssuer(),
                ValidAudience = settingsProvider.GetAuthValidAudience(),
                ValidateIssuer = true,
                ValidateAudience = true,
                ClockSkew = TimeSpan.Zero
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

    private string CleanJWTToken(string token)
    {
        return token.Replace("Bearer ", string.Empty);
    }

}
