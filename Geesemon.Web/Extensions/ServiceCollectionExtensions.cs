using Geesemon.Model.Enums;
using Geesemon.Web.GraphQL;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.Services;
using GraphQL;
using GraphQL.Server;
using GraphQL.SystemTextJson;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace Geesemon.Web.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddGraphQLApi(this IServiceCollection services)
        {
            services.AddScoped<ApplicationSchema>();
            services.AddGraphQLUpload();
            services
                 .AddGraphQL(options =>
                 {
                     options.EnableMetrics = true;
                     options.UnhandledExceptionDelegate = (context) =>
                     {
                         Console.WriteLine(context.Exception.StackTrace);
                         context.ErrorMessage = context.Exception.Message;
                     };
                 })
                 .AddSystemTextJson()
                 .AddWebSockets()
                 .AddGraphTypes(typeof(ApplicationSchema), ServiceLifetime.Scoped)
                 .AddGraphQLAuthorization(options =>
                 {
                     options.AddPolicy(AuthPolicies.Authenticated, p => p.RequireAuthenticatedUser());
                     options.AddPolicy(AuthPolicies.User, p => p.RequireClaim(ClaimTypes.Role, UserRole.User.ToString(), UserRole.Admin.ToString()));
                     options.AddPolicy(AuthPolicies.Admin, p => p.RequireClaim(ClaimTypes.Role, UserRole.Admin.ToString()));
                 });
            return services;
        }

        public static IServiceCollection AddJwtAuthorization(this IServiceCollection services)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidateIssuerSigningKey = true,
                    ValidAudience = Environment.GetEnvironmentVariable("AuthValidAudience"),
                    ValidIssuer = Environment.GetEnvironmentVariable("AuthValidIssuer"),
                    RequireSignedTokens = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("AuthIssuerSigningKey"))),
                };
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
            });

            return services;
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddSingleton<AuthService>();
            services.AddSingleton<FileManagerService>();
            return services;
        }
    }
}
