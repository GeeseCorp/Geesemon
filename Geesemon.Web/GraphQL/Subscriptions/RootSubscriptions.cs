using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services.ChatActionsSubscription;
using Geesemon.Web.Services.ChatActivitySubscription;
using Geesemon.Web.Services.MessageSubscription;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Subscriptions
{
    public partial class RootSubscriptions : ObjectGraphType
    {
        private readonly IMessageActionSubscriptionService messageActionSubscriptionService;
        private readonly IChatActionSubscriptionService chatActionSubscriptionService;
        private readonly IChatActivitySubscriptionService chatActivitySubscriptionService;
        private readonly IHttpContextAccessor httpContextAccessor;

        public RootSubscriptions(IMessageActionSubscriptionService messageActionSubscriptionService,
            IChatActionSubscriptionService chatActionSubscriptionService,
            IChatActivitySubscriptionService chatActivitySubscriptionService,
            IHttpContextAccessor httpContextAccessor)
        {
            // Messages
            Field<MessageActionType, MessageAction>()
                .Name("MessageActions")
                .Resolve(ResolveMessage)
                .SubscribeAsync(SubscribeMessage)
                .AuthorizeWith(AuthPolicies.Authenticated);

            // Chats
            Field<ChatActionType, ChatAction>()
                .Name("ChatActions")
                .Resolve(ResolveChat)
                .SubscribeAsync(SubscribeChat)
                .AuthorizeWith(AuthPolicies.Authenticated);
            
            Field<UserChatType, UserChat>()
                .Name("ChatActivity")
                .Argument<GuidGraphType, Guid>("ChatId", "")
                .Resolve(ResolveChatActivity)
                .SubscribeAsync(SubscribeChatActivity)
                .AuthorizeWith(AuthPolicies.Authenticated);

            this.messageActionSubscriptionService = messageActionSubscriptionService;
            this.chatActionSubscriptionService = chatActionSubscriptionService;
            this.chatActivitySubscriptionService = chatActivitySubscriptionService;
            this.httpContextAccessor = httpContextAccessor;
        }
    }
}
