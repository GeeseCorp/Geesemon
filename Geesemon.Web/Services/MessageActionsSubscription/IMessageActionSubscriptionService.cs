using Geesemon.Model.Models;

namespace Geesemon.Web.Services.MessageSubscription
{
    public interface IMessageActionSubscriptionService
    {
        Message Notify(Message message, MessageActionKind type);

        Task<IObservable<MessageAction>> Subscribe(Guid user);

        Task<Message> SentSystemMessageAsync(string text, Guid chatId);
        
        Task<Message> SentSystemGeeseMessageAsync(string text, Guid chatId, string[] arguments);
    }
}
