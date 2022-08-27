using Geesemon.Model.Models;

namespace Geesemon.Web.Services.MessageSubscription
{
    public interface IMessagerSubscriptionService
    {
        Message SendAction(Message message);

        Task<IObservable<Message>> Subscribe(Guid user);
    }
}
