using Geesemon.DataAccess.Providers.SessionProvider;
using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Managers
{
    public class SessionManager : SessionProvider, IManager<Session>
    {
        public SessionManager(AppDbContext appContext) 
            : base(appContext)
        { }
    }
}
