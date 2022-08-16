using Geesemon.DomainModel.Models.Auth;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types.Message;
using Geesemon.Web.Model;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Subscriptions.Chat
{
    public class ChatSubscriptions : ObjectGraphType
    {
        private readonly IChat chat;

        private readonly IHttpContextAccessor httpContextAccessor;

        public ChatSubscriptions(IChat chat, IHttpContextAccessor httpContextAccessor)
        {
            this.chat = chat;
            this.httpContextAccessor = httpContextAccessor;
            AddField(new FieldType
            {
                Name = "messageAdded",
                Type = typeof(MessageType),
                Resolver = new FuncFieldResolver<Message>(ResolveMessage),
                StreamResolver = new SourceStreamResolver<Message>(Subscribe)  
            })
            .AuthorizeWithPolicy(AuthPolicies.Authenticated);
        }

        private Message ResolveMessage(IResolveFieldContext context)
        {
            var message = context.Source as Message;

            return message;
        }

        private IObservable<Message> Subscribe(IResolveFieldContext context)
        {
            string currentUserId = httpContextAccessor?.HttpContext?.User.Claims?.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType)?.Value;

            return chat.Subscribe(currentUserId);
        }
    }
}
