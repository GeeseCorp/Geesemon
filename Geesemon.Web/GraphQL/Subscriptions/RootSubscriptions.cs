using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services.ChatActionsSubscription;
using Geesemon.Web.Services.MessageSubscription;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Subscriptions
{
    public partial class RootSubscriptions : ObjectGraphType
    {
        private readonly IMessageActionSubscriptionService messageSubscriptionService;

        private readonly IChatActionSubscriptionService chatSubscriptionService;

        private readonly IHttpContextAccessor httpContextAccessor;

        public RootSubscriptions(IMessageActionSubscriptionService messageSubscriptionService,
            IChatActionSubscriptionService chatSubscriptionService,
            IHttpContextAccessor httpContextAccessor)
        {
            Field<MessageActionType, MessageAction>()
                .Name("MessageActions")
                .Resolve(ResolveMessage)
                .SubscribeAsync(SubscribeMessage)
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<ChatActionType, ChatAction>()
                .Name("ChatActions")
                .Resolve(ResolveChat)
                .SubscribeAsync(SubscribeChat)
                .AuthorizeWith(AuthPolicies.Authenticated);

            this.messageSubscriptionService = messageSubscriptionService;
            this.chatSubscriptionService = chatSubscriptionService;
            this.httpContextAccessor = httpContextAccessor;
        }
    }
}
