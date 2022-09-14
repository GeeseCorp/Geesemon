using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Geesemon.Web.Services.MessageSubscription
{
    public class MessageActionSubscriptionService : IMessageActionSubscriptionService
    {
        private readonly ISubject<MessageAction> messageActionStream = new Subject<MessageAction>();

        private readonly IServiceProvider serviceProvider;
        public MessageActionSubscriptionService(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        public Message Notify(Message message, MessageActionKind type)
        {
            messageActionStream.OnNext(new MessageAction { Message = message, Type = type });
            return message;
        }

        public async Task<IObservable<MessageAction>> Subscribe(Guid userId)
        {
            return messageActionStream
                .Where(m =>
                {
                    using var scope = serviceProvider.CreateScope();
                    var chatManager = scope.ServiceProvider.GetRequiredService<ChatManager>();
                    var chats = chatManager.GetAllForUserAsync(userId).GetAwaiter().GetResult();
                    var chatIdList = chats.Select(c => c.Id);

                    return chatIdList.Contains(m.Message.ChatId);
                })
                .AsObservable();
        }

        public void AddError(Exception exception)
        {
            messageActionStream.OnError(exception);
        }
    }
}
