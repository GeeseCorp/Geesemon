using Geesemon.Model.Models;
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

            return await chatActionSubscriptionService.Subscribe(currentUserId);
        }
        
        private Chat ResolveChatActivity(IResolveFieldContext context)
        {
            return context.Source as Chat;
        }

        private async Task<IObservable<Chat>> SubscribeChatActivity(IResolveFieldContext context)
        {
            var chatId = context.GetArgument<Guid>("ChatId");
            return await chatActivitySubscriptionService.Subscribe(chatId);
        }
    }
}
