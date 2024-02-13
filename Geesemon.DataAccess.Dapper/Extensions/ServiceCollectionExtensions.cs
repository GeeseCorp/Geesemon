using Geesemon.DataAccess.Dapper.Providers;

using Microsoft.Extensions.DependencyInjection;

namespace Geesemon.DataAccess.Dapper.Extensions;
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDapperServices(this IServiceCollection services)
    {
        services.AddSingleton<DapperConnection>();

        services.AddProviders();

        return services;
    }

    private static IServiceCollection AddProviders(this IServiceCollection services)
    {
        services.AddSingleton<UserProvider>();


        return services;
    }
}