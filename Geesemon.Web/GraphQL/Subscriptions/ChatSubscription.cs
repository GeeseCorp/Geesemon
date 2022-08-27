using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services.MessageSubscription;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Subscriptions
{
    public class MessageSubscription : ObjectGraphType
    {
        private readonly IMessageActionSubscriptionService chat;

        private readonly IHttpContextAccessor httpContextAccessor;

        public MessageSubscription(IMessageActionSubscriptionService chat, IHttpContextAccessor httpContextAccessor)
        {
            this.chat = chat;
            this.httpContextAccessor = httpContextAccessor;

            Field<MessageActionType, MessageAction>()
                .Name("Actions")
                .Resolve(ResolveMessage)
                .SubscribeAsync(Subscribe)
                .AuthorizeWith(AuthPolicies.Authenticated);
        }

        private MessageAction ResolveMessage(IResolveFieldContext context)
        {
            var message = context.Source as MessageAction;

            return message;
        }

        private async Task<IObservable<MessageAction>> Subscribe(IResolveFieldContext context)
        {
            var currentUserId = httpContextAccessor?.HttpContext?.User.Claims?.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType)?.Value;

            return await chat.Subscribe(Guid.Parse(currentUserId));
        }
    }
}
