using Geesemon.DataAccess.Providers.UserProvider;
using Geesemon.Model.Enums;
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
