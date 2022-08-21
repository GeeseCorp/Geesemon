using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using System.Collections.Concurrent;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Geesemon.Web.Model
{
    public class Chat : IChat
    {
        private readonly ISubject<Message> _messageStream = new Subject<Message>();
        
        private readonly IServiceProvider serviceProvider;
        public Chat(IServiceProvider serviceProvider, IHttpContextAccessor httpContextAccessor)
        {
            AllMessages = new ConcurrentStack<Message>();
            this.serviceProvider = serviceProvider;
        }


        public ConcurrentStack<Message> AllMessages { get; }

        public Message AddMessage(Message message)
        {
            AllMessages.Push(message);
            _messageStream.OnNext(message);
            return message;
        }

        public async Task<IObservable<Message>> Subscribe(Guid userId)
        {
            return _messageStream
                .Where(m => {
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
