
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;

using GraphQL;
using GraphQL.DataLoader;

namespace Geesemon.Web.GraphQL.DataLoaders;

public class SessionLoader
{
    private readonly IDataLoaderContextAccessor loaderContextAccessor;
    private readonly IServiceProvider serviceProvider;

    public SessionLoader(IDataLoaderContextAccessor loaderContextAccessor, IServiceProvider serviceProvider)
    {
        this.loaderContextAccessor = loaderContextAccessor;
        this.serviceProvider = serviceProvider;
    }

    public IDataLoaderResult<T> ResolveLastActive<T>(Func<Session, T> resolve, IResolveFieldContext<User> context)
        => LoadLastActive(context.Source.Id).Then(resolve);

    public IDataLoaderResult<Session> LoadLastActive(Guid userId)
    {
        return loaderContextAccessor
            .Context
            .GetOrAddBatchLoader<Guid, Session>(nameof(SessionLoader), FetchAsync)
            .LoadAsync(userId);
    }
    private async Task<IDictionary<Guid, Session>> FetchAsync(IEnumerable<Guid> userIds)
    {
        using var scope = serviceProvider.CreateScope();
        var sessions = await scope.ServiceProvider.GetRequiredService<SessionManager>().GetLastsActiveAsync(userIds);
        return sessions.ToDictionary(s => s.UserId);
    }
}

