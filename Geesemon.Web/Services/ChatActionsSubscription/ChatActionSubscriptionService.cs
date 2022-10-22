using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Geesemon.Web.Services.ChatActionsSubscription
{
    public class ChatActionSubscriptionService : IChatActionSubscriptionService
    {
        private readonly ISubject<ChatAction> chatActionStream = new Subject<ChatAction>();

        public Chat Notify(Chat chat, ChatActionKind type, IEnumerable<Guid> forUserIds)
        {
            foreach(var forUserId in forUserIds)
                chatActionStream.OnNext(new ChatAction { Chat = chat, Type = type, ForUserId = forUserId });
            return chat;
        }

        public async Task<IObservable<ChatAction>> Subscribe(Guid forUserId)
        {
            return chatActionStream
                .Where(ca => ca.ForUserId == forUserId)
                .AsObservable();
        }

        public void AddError(Exception exception)
        {
            chatActionStream.OnError(exception);
        }
    }
}
