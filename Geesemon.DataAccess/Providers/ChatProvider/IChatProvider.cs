using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers.ChatProvider
{
    public interface IChatProvider : IProviderBase<Chat>
    {
        Task<int> GetMembersOnlineAsync(Guid chatId);
        Task<int> GetMembersTotalAsync(Guid chatId);
        Task<List<Chat>> GetAllForUserAsync(Guid userId);
    }
}