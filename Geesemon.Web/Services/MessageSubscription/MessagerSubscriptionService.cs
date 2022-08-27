using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using System.Collections.Concurrent;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Geesemon.Web.Services.MessageSubscription
{
    public class MessagerSubscriptionService : IMessagerSubscriptionService
    {
        private readonly ISubject<Message> _messageStream = new Subject<Message>();

        private readonly IServiceProvider serviceProvider;
        public MessagerSubscriptionService(IServiceProvider serviceProvider, IHttpContextAccessor httpContextAccessor)
        {
            this.serviceProvider = serviceProvider;
        }

        public Message SendAction(Message message)
        {
            _messageStream.OnNext(message);
            return message;
        }

        public async Task<IObservable<Message>> Subscribe(Guid userId)
        {
            return _messageStream
                .Where(m =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var chatManager = scope.ServiceProvider.GetRequiredService<ChatManager>();
                    var chats = chatManager.GetAsync(userId).GetAwaiter().GetResult();
                    var chatIdList = chats.Select(c => c.Id);

                    return chatIdList.Contains(m.ChatId);
                })
                .AsObservable();
        }

        public void AddError(Exception exception)
        {
            _messageStream.OnError(exception);
        }
    }
}
