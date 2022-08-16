using Geesemon.Web.GraphQL.Subscriptions.Chat;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Subscriptions
{
    public class RootSubscriptions : ObjectGraphType
    {
        public RootSubscriptions()
        {
            Field<ChatSubscriptions>()
                .Name("Chat")
                .Resolve(_ => new { });
        }
    }
}
