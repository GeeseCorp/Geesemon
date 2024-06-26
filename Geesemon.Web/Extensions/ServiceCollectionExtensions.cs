﻿using FluentValidation;

using Geesemon.Migrations;
using Geesemon.Model.Enums;
using Geesemon.Web.Geesetext;
using Geesemon.Web.GraphQL;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.DataLoaders;
using Geesemon.Web.Middlewares;
using Geesemon.Web.Services;
using Geesemon.Web.Services.ChatActionsSubscription;
using Geesemon.Web.Services.ChatActivitySubscription;
using Geesemon.Web.Services.FileManagers;
using Geesemon.Web.Services.LoginViaTokenSubscription;
using Geesemon.Web.Services.MessageSubscription;
using Geesemon.Web.Utils.SettingsAccess;

using GraphQL;
using GraphQL.DataLoader;
using GraphQL.Server;
using GraphQL.Server.Transports.Subscriptions.Abstractions;
using GraphQL.SystemTextJson;

using Microsoft.AspNetCore.Server.Kestrel.Core;

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
            services.AddSingleton<IDocumentExecuter, AppDocumentExecuter>();
            services.AddTransient<IOperationMessageListener, AuthenticationListener>();
            services.AddSingleton<IDataLoaderContextAccessor, DataLoaderContextAccessor>();
            services.AddSingleton<DataLoaderDocumentListener>();
            services.AddScoped<UserLoader>();
            services.AddScoped<MessageLoader>();
            services.AddScoped<SessionLoader>();
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
            services
                 .AddAuthentication(BasicAuthenticationHandler.SchemeName)
                 .AddScheme<BasicAuthenticationOptions, BasicAuthenticationHandler>(BasicAuthenticationHandler.SchemeName, _ => { });
            return services;
        }

        public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<ISettingsProvider, AppSettingsProvider>();
            services.AddSingleton<AuthService>();
            services.AddSingleton<IMessageActionSubscriptionService, MessageActionSubscriptionService>();
            services.AddSingleton<IChatActionSubscriptionService, ChatActionSubscriptionService>();
            services.AddSingleton<IChatActivitySubscriptionService, ChatActivitySubscriptionService>();
            services.AddSingleton<IChatMembersSubscriptionService, ChatMembersSubscriptionService>();
            services.AddSingleton<ILoginViaTokenSubscriptionService, LoginViaTokenSubscriptionService>();
            services.AddSingleton<GeeseTextsAccessor>();

            services.AddHostedService<MigrationHostedService>();
            services.AddHostedService<MakeOfflineService>();

            var fileProvider = configuration.GetValue<FileProvider>("FileProvider");
            switch (fileProvider)
            {
                case FileProvider.Local:
                    services.AddSingleton<IFileManagerService, LocalFileManagerService>();
                    break;
                case FileProvider.Blob:
                    services.AddSingleton<IFileManagerService, BlobFileManagerService>();
                    break;
                case FileProvider.Cloudinary:
                    services.AddSingleton<IFileManagerService, CloudinaryFileManagerService>();
                    break;
            }

            services.Configure<KestrelServerOptions>(options =>
            {
                options.Limits.MaxRequestBodySize = int.MaxValue;
            });

            return services;
        }
    }
}
