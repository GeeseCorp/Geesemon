using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers
{
    public interface IChatProvider : IProviderBase<Chat>
    {
        Task<List<Chat>> GetAsync(Guid userId);
    }
}