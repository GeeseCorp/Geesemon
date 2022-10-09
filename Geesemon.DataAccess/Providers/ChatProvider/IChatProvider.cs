using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers.ChatProvider
{
    public interface IChatProvider : IProviderBase<Chat>
    {
        Task<int> GetMembersOnline(Guid chatId);
        Task<int> GetMembersTotal(Guid chatId);

        Task<List<Chat>> GetAllForUserAsync(Guid userId);
    }
}