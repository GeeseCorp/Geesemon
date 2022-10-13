using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers.MessageProvider
{
    public interface IMessageProvider : IProviderBase<Message>
    {
        Task<int> GetNotReadMessagesCount(Guid chatId, Guid currentUserId);
        Task<List<Message>> GetByChatIdAsync(Guid chatId, int skipMessageCount, int getMessageCount = 30);
    }
}