using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services.ChatActionsSubscription;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Subscriptions
{
    public partial class RootSubscriptions : ObjectGraphType
    {

        private ChatAction ResolveChat(IResolveFieldContext context)
        {
            var message = context.Source as ChatAction;

            return message;
        }

        private async Task<IObservable<ChatAction>> SubscribeChat(IResolveFieldContext context)
        {
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

            return await chatSubscriptionService.Subscribe(currentUserId);
        }
    }
}
