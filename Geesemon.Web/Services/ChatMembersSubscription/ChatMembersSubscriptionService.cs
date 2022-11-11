using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Geesemon.Web.Services.ChatActionsSubscription
{
    public class ChatMembersSubscriptionService : IChatMembersSubscriptionService
    {
        private readonly ISubject<ChatMembers> chatMembersStream = new Subject<ChatMembers>();

        public void Notify(User user, ChatMembersKind type, Guid chatId)
        {
            chatMembersStream.OnNext(new ChatMembers { User = user, Type = type, ChatId = chatId });
        }

        public IObservable<ChatMembers> Subscribe(Guid chatId)
        {
            return chatMembersStream
                .Where(cm => cm.ChatId == chatId)
                .AsObservable();
        }

        public void AddError(Exception exception)
        {
            chatMembersStream.OnError(exception);
        }
    }
}
