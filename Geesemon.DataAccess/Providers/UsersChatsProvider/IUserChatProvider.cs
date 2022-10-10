using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers.UsersChatsProvider
{
    public interface IUserChatProvider : IManyToManyProviderBase<UserChat>
    {
        Task<List<UserChat>> GetPersonalByUserIdsAsync(Guid userIds1, Guid userId2);
    }
}