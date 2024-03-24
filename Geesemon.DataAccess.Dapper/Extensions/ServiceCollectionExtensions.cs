using Dapper;

using Geesemon.DataAccess.Dapper.Providers;
using Geesemon.DataAccess.Dapper.TypeHandlers;
using Geesemon.Model.Common;

using Microsoft.Extensions.DependencyInjection;

namespace Geesemon.DataAccess.Dapper.Extensions;
public static class ServiceCollectionExtensions
{
    public static IServiceCollection InitializeDapper(this IServiceCollection services)
    {
        AddDapperServices(services);
        AddProviders(services);
        AddSqlMappers();

        return services;
    }

    private static IServiceCollection AddDapperServices(IServiceCollection services)
    {
        services.AddSingleton<DbConnection>();

        return services;
    }

    private static IServiceCollection AddProviders(IServiceCollection services)
    {
        services.AddSingleton<UserProvider>();
        services.AddSingleton<MessageProvider>();

        return services;
    }

    private static void AddSqlMappers()
    {
        SqlMapper.AddTypeHandler(typeof(string[]), new JsonTypeHandler<string[]>());
        SqlMapper.AddTypeHandler(typeof(ForwardedMessage), new JsonTypeHandler<ForwardedMessage>());
    }
}