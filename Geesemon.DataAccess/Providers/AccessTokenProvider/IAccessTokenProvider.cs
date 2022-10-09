using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers.AccessTokenProvider;
public interface ISessionProvider : IProviderBase<Session>
{
    Task MakeAllOfflineAsync();
    Task<Session?> GetByToken(string token);
    Task<Session?> GetLastActive(Guid userId);
    Task RemoveAsync(Guid userId, string token);
    Task RemoveAllForUserAsync(Guid userId);
}
