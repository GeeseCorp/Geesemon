using Geesemon.Model.Models;

namespace Geesemon.Web.Services.ChatActionsSubscription
{
    public interface IChatActionSubscriptionService
    {
        Chat Notify(Chat message, ChatActionKind type);

        Task<IObservable<ChatAction>> Subscribe(Guid user);
    }
}
