using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers.ChatProvider
{
    public interface IChatProvider : IProviderBase<Chat>
    {
        Task<Chat?> GetByUsername(string chatUsername);
        Task<int> GetMembersOnlineAsync(Guid chatId);
        Task<int> GetMembersTotalAsync(Guid chatId);
        Task<IEnumerable<Chat>> GetAllForUserAsync(Guid userId);
        Task<IEnumerable<Chat>> GetPaginatedForUserAsync(Guid userId, int skipMessageCount, int takeMessageCount = 30);
    }
}