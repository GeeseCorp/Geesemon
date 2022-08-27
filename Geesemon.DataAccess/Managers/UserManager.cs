using Geesemon.DataAccess.Providers;
using Geesemon.DataAccess.Providers.UserProvider;
using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Managers
{
    public class UserManager : UserProvider, IManager<User>
    {
        public UserManager(AppDbContext appContext) 
            : base(appContext)
        { }
    }
}
