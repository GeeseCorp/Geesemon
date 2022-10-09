using Geesemon.DataAccess.Managers;

namespace Geesemon.Web.Services;

public class MakeOfflineService : IHostedService
{
    private readonly IServiceProvider serviceProvider;

    public MakeOfflineService(IServiceProvider serviceProvider)
    {
        this.serviceProvider = serviceProvider;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
        var sessionManager = scope.ServiceProvider.GetRequiredService<SessionManager>();
        await sessionManager.MakeAllOfflineAsync();
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
