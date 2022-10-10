using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers.SessionProvider;
public interface ISessionProvider : IProviderBase<Session>
{
    Task MakeAllOfflineAsync();
    Task<Session?> GetByTokenAsync(string token);
    Task<Session?> GetLastActiveAsync(Guid userId);
    Task RemoveAsync(Guid userId, string token);
    Task RemoveAllForUserAsync(Guid userId);
}
