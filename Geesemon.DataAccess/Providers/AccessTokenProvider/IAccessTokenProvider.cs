using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers.AccessTokenProvider;
public interface IAccessTokenProvider : IProviderBase<AccessToken>
{
    Task RemoveAsync(Guid userId, string token);
    Task RemoveAllForUserAsync(Guid userId);
}
