using Geesemon.DataAccess.Dapper.Providers;
using Geesemon.Model.Models;

using GraphQL.DataLoader;

namespace Geesemon.Web.GraphQL.DataLoaders;

public class UserLoader
{
    private readonly IDataLoaderContextAccessor loaderContextAccessor;
    private readonly IServiceProvider serviceProvider;
    private readonly UserProvider userProvider;

    public UserLoader(IDataLoaderContextAccessor loaderContextAccessor, IServiceProvider serviceProvider, UserProvider userProvider)
    {
        this.loaderContextAccessor = loaderContextAccessor;
        this.serviceProvider = serviceProvider;
        this.userProvider = userProvider;
    }

    public IDataLoaderResult<User> Load(Guid userId)
    {
        var loader = loaderContextAccessor.Context.GetOrAddBatchLoader<Guid, User>(nameof(UserLoader), FetchAsync);
        return loader.LoadAsync(userId);
    }
    private async Task<IDictionary<Guid, User>> FetchAsync(IEnumerable<Guid> ids)
    {
        using var scope = serviceProvider.CreateScope();
        var users = await userProvider.GetByIdsAsync(ids);
        return users.ToDictionary(u => u.Id);
    }
}

