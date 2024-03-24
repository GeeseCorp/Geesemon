using Geesemon.DataAccess.Managers;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Geesemon.DataAccess.Extensions;
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddMsSql(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<AppDbContext>((options) =>
        {
            options.UseSqlServer(connectionString ?? AppDbContext.DefaultConnectionString, b => b.MigrationsAssembly("Geesemon.DataAccess"));
        });

        services.AddScoped<ChatManager>();
        services.AddScoped<UserChatManager>();
        services.AddScoped<SessionManager>();
        services.AddScoped<ReadMessagesManager>();
        return services;
    }
}
