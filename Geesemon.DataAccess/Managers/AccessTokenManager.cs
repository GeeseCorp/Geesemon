using Geesemon.DataAccess.Providers;
using Geesemon.DataAccess.Providers.AccessTokenProvider;
using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Managers
{
    public class AccessTokenManager : AccessTokenProvider, IManager<AccessToken>
    {
        public AccessTokenManager(AppDbContext appContext) 
            : base(appContext)
        { }
    }
}
