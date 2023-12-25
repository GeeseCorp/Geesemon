
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;

using GraphQL.DataLoader;

namespace Geesemon.Web.GraphQL.DataLoaders;

public class UserLoader
{
    private readonly IDataLoaderContextAccessor loaderContextAccessor;
    private readonly IServiceProvider serviceProvider;

    public UserLoader(IDataLoaderContextAccessor loaderContextAccessor, IServiceProvider serviceProvider)
    {
        this.loaderContextAccessor = loaderContextAccessor;
        this.serviceProvider = serviceProvider;
    }

    public IDataLoaderResult<User> Load(Guid userId)
    {
        var loader = loaderContextAccessor.Context.GetOrAddBatchLoader<Guid, User>(nameof(UserLoader), FetchAsync);
        return loader.LoadAsync(userId);
    }
    private async Task<IDictionary<Guid, User>> FetchAsync(IEnumerable<Guid> ids)
    {
        using var scope = serviceProvider.CreateScope();
        var users = await scope.ServiceProvider.GetRequiredService<UserManager>().GetByIdsAsync(ids);
        return users.ToDictionary(u => u.Id);
    }
}

