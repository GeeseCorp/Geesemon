using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services;
using Geesemon.Web.Services.ChatActionsSubscription;
using Geesemon.Web.Services.ChatActivitySubscription;
using Geesemon.Web.Services.MessageSubscription;
using GraphQL;
using GraphQL.Types;
using System.Reactive.Linq;

namespace Geesemon.Web.GraphQL.Subscriptions
{
    public class RootSubscriptions : ObjectGraphType
    {
        public RootSubscriptions(
            IMessageActionSubscriptionService messageActionSubscriptionService,
            IChatActionSubscriptionService chatActionSubscriptionService,
            IChatActivitySubscriptionService chatActivitySubscriptionService,
            IHttpContextAccessor httpContextAccessor,
            IServiceProvider serviceProvider,
            AuthService authService,
            IChatMembersSubscriptionService chatMembersSubscriptionService
            )
        {
            // Messages
            Field<NonNullGraphType<MessageActionType>, MessageAction>()
                .Name("MessageActions")
                .SubscribeAsync(async context =>
                {
                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    return await messageActionSubscriptionService.Subscribe(currentUserId);
                })
                .Resolve(context =>
                {
                    var message = context.Source as MessageAction;
                    return message;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            // Chats
            Field<NonNullGraphType<ChatActionType>, ChatAction>()
                .Name("ChatActions")
                .Argument<NonNullGraphType<StringGraphType>, string>("Token", "")
                .SubscribeAsync(async context =>
                {
                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    return await chatActionSubscriptionService.Subscribe(currentUserId);
                })
                .ResolveAsync(async context =>
                {
                    var token = context.GetArgument<string>("Token");
                    var claimsPrimcipal = authService.ValidateAccessToken(token);
                    var currentUserId = claimsPrimcipal.Identities.First().Claims.GetUserId();

                    var chatAction = context.Source as ChatAction;
                    chatAction.Chat = await chatAction.Chat.MapForUserAsync(currentUserId, serviceProvider);
                    return chatAction;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
            
            Field<NonNullGraphType<UserChatType>, UserChat>()
                .Name("ChatActivity")
                .Argument<NonNullGraphType<GuidGraphType>, Guid>("ChatId", "")
                .Argument<NonNullGraphType<StringGraphType>, string>("Token", "")
                .SubscribeAsync(async context =>
                {
                    var chatId = context.GetArgument<Guid>("ChatId");
                    return await chatActivitySubscriptionService.Subscribe(chatId);
                })
                .ResolveAsync(async context =>
                {
                    var token = context.GetArgument<string>("Token");
                    var claimsPrimcipal = authService.ValidateAccessToken(token);
                    var currentUserId = claimsPrimcipal.Identities.First().Claims.GetUserId();

                    var userChat = context.Source as UserChat;
                    userChat.Chat = await userChat.Chat.MapForUserAsync(currentUserId, serviceProvider);
                    return userChat;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
            
            Field<NonNullGraphType<ChatMembersType>, ChatMembers>()
                .Name("ChatMembers")
                .Argument<NonNullGraphType<GuidGraphType>, Guid>("ChatId", "")
                .Argument<NonNullGraphType<StringGraphType>, string>("Token", "")
                .Subscribe(context =>
                {
                    var chatId = context.GetArgument<Guid>("ChatId");
                    return chatMembersSubscriptionService.Subscribe(chatId);
                })
                .Resolve(context =>
                {
                    var token = context.GetArgument<string>("Token");
                    var claimsPrimcipal = authService.ValidateAccessToken(token);
                    var currentUserId = claimsPrimcipal.Identities.First().Claims.GetUserId();
                    return context.Source as ChatMembers;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
