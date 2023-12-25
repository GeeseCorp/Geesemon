using GraphQL;
using GraphQL.DataLoader;

namespace Geesemon.Web.GraphQL;

public class AppDocumentExecuter : SubscriptionDocumentExecuter
{
    private readonly IServiceProvider serviceProvider;

    public AppDocumentExecuter(IServiceProvider serviceProvider)
    {
        this.serviceProvider = serviceProvider;
    }

    public override Task<ExecutionResult> ExecuteAsync(ExecutionOptions options)
    {
        var listener = serviceProvider.GetRequiredService<DataLoaderDocumentListener>();
        options.Listeners.Add(listener);
        return base.ExecuteAsync(options);
    }
}
