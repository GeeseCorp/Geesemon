using FluentValidation;
using Geesemon.Model.Enums;
using Geesemon.Web.Geesetext;
using Geesemon.Web.GraphQL;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.Middlewares;
using Geesemon.Web.Services;
using Geesemon.Web.Services.ChatActionsSubscription;
using Geesemon.Web.Services.ChatActivitySubscription;
using Geesemon.Web.Services.LoginViaTokenSubscription;
using Geesemon.Web.Services.MessageSubscription;
using Geesemon.Web.Utils.SettingsAccess;
using GraphQL;
using GraphQL.Server;
using GraphQL.Server.Transports.Subscriptions.Abstractions;
using GraphQL.SystemTextJson;
using System.Reflection;
using System.Security.Claims;

namespace Geesemon.Web.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddGraphQLApi(this IServiceCollection services)
        {
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddHttpContextAccessor();
            services.AddTransient<IOperationMessageListener, AuthenticationListener>();
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

        public static IServiceCollection AddJwtAuthorization(this IServiceCollection services, ISettingsProvider settingsProvider)
        {
            services
                 .AddAuthentication(BasicAuthenticationHandler.SchemeName)
                 .AddScheme<BasicAuthenticationOptions, BasicAuthenticationHandler>(BasicAuthenticationHandler.SchemeName, _ => { });
            return services;
        }

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddHostedService<MakeOfflineService>();

            services.AddSingleton<ISettingsProvider, AppSettingsProvider>();

            services.AddSingleton<AuthService>();
            services.AddSingleton<FileManagerService>();

            services.AddSingleton<IMessageActionSubscriptionService, MessageActionSubscriptionService>();
            services.AddSingleton<IChatActionSubscriptionService, ChatActionSubscriptionService>();
            services.AddSingleton<IChatActivitySubscriptionService, ChatActivitySubscriptionService>();
            services.AddSingleton<IChatMembersSubscriptionService, ChatMembersSubscriptionService>();
            services.AddSingleton<ILoginViaTokenSubscriptionService, LoginViaTokenSubscriptionService>();
            
            services.AddSingleton<GeeseTextsAccessor>();

            return services;
        }
    }
}
