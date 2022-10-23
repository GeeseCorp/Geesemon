using Geesemon.Model.Models;

namespace Geesemon.Web.Services.ChatActionsSubscription
{
    public interface IChatMembersSubscriptionService
    {
        void Notify(User user, ChatMembersKind type, Guid chatId);
        IObservable<ChatMembers> Subscribe(Guid chatId);
    }
}
