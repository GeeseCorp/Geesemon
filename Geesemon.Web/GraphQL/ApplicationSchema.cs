using Geesemon.Web.GraphQL.Mutations;
using Geesemon.Web.GraphQL.Queris;
using Geesemon.Web.GraphQL.Subscriptions;
using Geesemon.Web.GraphQL.Subscriptions.Chat;
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
            Subscription = provider.GetRequiredService<ChatSubscriptions>();
        }
    }
}
