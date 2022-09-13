using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Geesemon.Web.Services.ChatActionsSubscription
{
    public class ChatActionSubscriptionService : IChatActionSubscriptionService
    {
        private readonly ISubject<ChatAction> chatActionStream = new Subject<ChatAction>();

        private readonly IServiceProvider serviceProvider;

        public ChatActionSubscriptionService(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        public Chat Notify(Chat chat, ChatActionKind type)
        {
            chatActionStream.OnNext(new ChatAction { Chat = chat, Type = type });
            return chat;
        }

        public async Task<IObservable<ChatAction>> Subscribe(Guid userId)
        {
            return chatActionStream
                .Where(m =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var chatManager = scope.ServiceProvider.GetRequiredService<ChatManager>();
                    var chats = chatManager.GetAllForUserAsync(userId).GetAwaiter().GetResult();
                    var chatIdList = chats.Select(c => c.Id);

                    return chatIdList.Contains(m.Chat.Id);
                })
                .AsObservable();
        }

        public void AddError(Exception exception)
        {
            chatActionStream.OnError(exception);
        }
    }
}
