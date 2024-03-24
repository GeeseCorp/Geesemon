
using Geesemon.DataAccess.Dapper.Providers;
using Geesemon.Model.Models;

using GraphQL.DataLoader;

namespace Geesemon.Web.GraphQL.DataLoaders;

public class MessageLoader
{
    private readonly IDataLoaderContextAccessor loaderContextAccessor;
    private readonly IServiceProvider serviceProvider;

    public MessageLoader(IDataLoaderContextAccessor loaderContextAccessor, IServiceProvider serviceProvider)
    {
        this.loaderContextAccessor = loaderContextAccessor;
        this.serviceProvider = serviceProvider;
    }

    public IDataLoaderResult<Message> Load(Guid messageId)
    {
        var loader = loaderContextAccessor.Context.GetOrAddBatchLoader<Guid, Message>(nameof(MessageProvider), FetchAsync);
        return loader.LoadAsync(messageId);
    }
    private async Task<IDictionary<Guid, Message>> FetchAsync(IEnumerable<Guid> ids)
    {
        using var scope = serviceProvider.CreateScope();
        var messages = await scope.ServiceProvider.GetRequiredService<MessageProvider>().GetByIdsAsync(ids);
        return messages.ToDictionary(m => m.Id);
    }
}

