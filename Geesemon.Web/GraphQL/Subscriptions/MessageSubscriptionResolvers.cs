using Geesemon.Web.Services.MessageSubscription;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Subscriptions
{
    public partial class RootSubscriptions : ObjectGraphType
    {
        private MessageAction ResolveMessage(IResolveFieldContext context)
        {
            var message = context.Source as MessageAction;
            return message;
        }

        private async Task<IObservable<MessageAction>> SubscribeMessage(IResolveFieldContext context)
        {
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
            return await messageActionSubscriptionService.Subscribe(currentUserId);
        }
    }
}
