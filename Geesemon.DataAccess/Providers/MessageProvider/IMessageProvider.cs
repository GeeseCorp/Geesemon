using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers.MessageProvider
{
    public interface IMessageProvider : IProviderBase<Message>
    {
        Task<List<Message>> GetByChatIdAsync(Guid chatId, int skipMessageCount, int getMessageCount = 30);
    }
}