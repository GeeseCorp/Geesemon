using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers.SessionProvider;
public interface ISessionProvider : IProviderBase<Session>
{
    Task MakeAllOfflineAsync();
    Task<Session?> GetByTokenAsync(string token);
    Task<List<Session>> GetLastActiveAsync(IEnumerable<Guid> userIds);
    Task RemoveAsync(Guid userId, string token);
    Task RemoveAllForUserAsync(Guid userId);
}
