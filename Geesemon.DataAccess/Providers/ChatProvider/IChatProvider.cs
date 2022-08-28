using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers.ChatProvider
{
    public interface IChatProvider : IProviderBase<Chat>
    {
        Task<List<Chat>> GetAsync(Guid userId);
    }
}