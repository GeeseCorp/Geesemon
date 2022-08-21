using Geesemon.Model.Models;

namespace Geesemon.Web.Model
{
    public interface IMessagerSubscriptionService
    { 
        Message AddMessage(Message message);

        Task<IObservable<Message>> Subscribe(Guid user);
    }
}
