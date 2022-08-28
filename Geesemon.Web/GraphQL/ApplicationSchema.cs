using Geesemon.Web.GraphQL.Mutations;
using Geesemon.Web.GraphQL.Queries;
using Geesemon.Web.GraphQL.Subscriptions;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL
{
    public class ApplicationSchema : Schema
    {
        public ApplicationSchema(IServiceProvider provider)
            : base(provider)
        {
            Query = provider.GetRequiredService<RootQuery>();
            Mutation = provider.GetRequiredService<RootMutation>();
            Subscription = provider.GetRequiredService<MessageSubscription>();
        }
    }
}
