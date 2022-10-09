using Geesemon.Model.Models;

namespace Geesemon.Web.Services.ChatActivitySubscription;

public interface IChatActivitySubscriptionService
{
    Task Notify(Guid userId);

    Task<IObservable<UserChat>> Subscribe(Guid chatId);
}
