using Geesemon.DataAccess.Managers;
using Geesemon.DomainModel.Models.Auth;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Utils.SettingsAccess;
using Geesemon.Web.GraphQL.Types.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EducationalPortal.Server.Services
{
    public class AuthService
    {
        private readonly IServiceProvider serviceProvider;

        private readonly ISettingsProvider settingsProvider;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IConfiguration configuration;

        public AuthService(IServiceProvider serviceProvider, ISettingsProvider settingsProvider, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this.serviceProvider = serviceProvider;
            this.settingsProvider = settingsProvider;
            this.httpContextAccessor = httpContextAccessor;
            this.configuration = configuration;
        }

        public async Task<AuthResponse> AuthenticateAsync(LoginInput loginAuthInput)
        {
            using var scope = serviceProvider.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
            UserModel? user = await userManager.GetByLoginAsync(loginAuthInput.Login);
            if (user == null || user.Password != loginAuthInput.Password)
                throw new Exception("Login or password not valid.");
            var token = GenerateAccessToken(user.Id, user.Login, user.Role);
            return new AuthResponse() { Token = token , User = user } ;
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

        public void ValidateJWTToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(configuration["AuthIssuerSigningKey"]);
                tokenHandler.ValidateToken(CleanJWTToken(token), new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidIssuer = configuration["AuthValidIssuer"],
                    ValidAudience = configuration["AuthValidAudience"],
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;

                ClaimsIdentity claimsIdentity = new ClaimsIdentity(jwtToken.Claims, JwtBearerDefaults.AuthenticationScheme);

                httpContextAccessor.HttpContext.User = new ClaimsPrincipal(claimsIdentity);
            }
            catch
            {
                throw new Exception("Fail to validate JWT token.");
            }
        }

        private string CleanJWTToken(string token)
        {
            return token.Replace("Bearer ", string.Empty);
        }

    }
}
