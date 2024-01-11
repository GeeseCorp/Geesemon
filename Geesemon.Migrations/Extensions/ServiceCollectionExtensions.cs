using FluentMigrator.Runner;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using System.Reflection;

namespace Geesemon.Migrations.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddMigrationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services
                .AddFluentMigratorCore()
                .ConfigureRunner(rb => rb
                    .AddSqlServer()
                    .WithGlobalConnectionString(configuration.GetValue<string>("ConnectionString"))
                    .ScanIn(Assembly.GetExecutingAssembly()).For.Migrations())
                .AddLogging(lb => lb.AddFluentMigratorConsole())
                .BuildServiceProvider(false);

            return services;
        }
    }
}