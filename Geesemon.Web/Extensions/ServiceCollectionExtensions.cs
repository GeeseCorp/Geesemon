using EducationalPortal.Server.Services;
using Geesemon.DomainModel.Models.Auth;
using Geesemon.Model.Enums;
using Geesemon.Web.GraphQL;
using GraphQL;
using GraphQL.Authorization;
using GraphQL.Execution;
using GraphQL.MicrosoftDI;
using GraphQL.Server;
using GraphQL.Server.Authorization.AspNetCore;
using GraphQL.Server.Transports.AspNetCore;
using GraphQL.SystemTextJson;
using GraphQL.Types;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace Geesemon.Web.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddGraphQLApi(this IServiceCollection services, bool isDevelopmentMode)
        {
            //services.AddSingleton<ApplicationSchema>();

            //services.AddSingleton<IDocumentExecuter, ApolloTracingDocumentExecuter>();
            //services.AddSingleton<IDocumentWriter, ApolloTracingDocumentExecuter>();


            //services.AddGraphQL(options =>
            //{
            //    options.EnableMetrics = true;
            //    options.UnhandledExceptionDelegate = (context) =>
            //    {
            //        Console.WriteLine("StackTrace: " + context.Exception.StackTrace);
            //        Console.WriteLine("Message: " + context.Exception.Message);
            //        context.ErrorMessage = context.Exception.Message;
            //    };
            //})
            //.AddSystemTextJson()
            //.AddWebSockets()
            //.AddDataLoader()
            //.AddGraphTypes(typeof(ApplicationSchema))
            //.AddGraphQLAuthorization(options =>
            //{
            //    options.AddPolicy(AuthPolicies.Authenticated.ToString(), p => p.RequireAuthenticatedUser());
            //    options.AddPolicy(AuthPolicies.User, p => p.RequireClaim(ClaimTypes.Role, UserRole.User.ToString(), UserRole.Admin.ToString()));
            //    options.AddPolicy(AuthPolicies.Admin, p => p.RequireClaim(ClaimTypes.Role, UserRole.Admin.ToString()));
            //});

            services.Configure<ErrorInfoProviderOptions>(opt => opt.ExposeExceptionStackTrace = isDevelopmentMode);
            services.AddTransient<IAuthorizationErrorMessageBuilder, DefaultAuthorizationErrorMessageBuilder>();
            services.AddGraphQL(builder => builder
           .AddApolloTracing()
           .AddHttpMiddleware<ApplicationSchema, GraphQLHttpMiddleware<ApplicationSchema>>()
           .AddWebSocketsHttpMiddleware<ApplicationSchema>()
           .AddSchema<ApplicationSchema>()
           .ConfigureExecutionOptions(options =>
           {
               options.EnableMetrics = true;

               using var loggerFactory = LoggerFactory.Create(loggingBuilder => loggingBuilder
                .SetMinimumLevel(LogLevel.Trace)
                .AddConsole());

               var logger = loggerFactory.CreateLogger<Program>();
               options.UnhandledExceptionDelegate = ctx =>
               {
                   logger.LogError("{Error} occurred", ctx.OriginalException.Message);
                   return Task.CompletedTask;
               };
           })
           .AddSystemTextJson()
           .AddErrorInfoProvider<ApplicationErrorInfoProvider>()
           .AddWebSockets()
           .AddGraphTypes(typeof(ApplicationSchema).Assembly)
           .AddGraphQLAuthorization(options =>
           {
               options.AddPolicy(AuthPolicies.Authenticated.ToString(), p => p.RequireAuthenticatedUser());
               options.AddPolicy(AuthPolicies.User, p => p.RequireClaim(ClaimTypes.Role, UserRole.User.ToString(), UserRole.Admin.ToString()));
               options.AddPolicy(AuthPolicies.Admin, p => p.RequireClaim(ClaimTypes.Role, UserRole.Admin.ToString()));
           }));

           services.AddScoped<ISchema, ApplicationSchema>(services => new ApplicationSchema(new SelfActivatingServiceProvider(services)));


            return services;
        }

        public static IServiceCollection AddJwtAuthorization(this IServiceCollection services, ConfigurationManager configurationManager)
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
                    ValidAudience = configurationManager.GetSection("AuthValidAudience").Value,
                    ValidIssuer = configurationManager.GetSection("AuthValidIssuer").Value,
                    RequireSignedTokens = false,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configurationManager.GetSection("AuthIssuerSigningKey").Value)),
                };
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
            });

            return services;
        }
        
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddSingleton<AuthService>();
            return services;
        }
    }
}
