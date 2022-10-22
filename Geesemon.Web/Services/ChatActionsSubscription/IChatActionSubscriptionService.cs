using Geesemon.Model.Models;

namespace Geesemon.Web.Services.ChatActionsSubscription
{
    public interface IChatActionSubscriptionService
    {
        Chat Notify(Chat message, ChatActionKind type, IEnumerable<Guid> forUserIds);

        Task<IObservable<ChatAction>> Subscribe(Guid forUserId);
    }
}
