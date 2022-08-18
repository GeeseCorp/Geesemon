using Geesemon.DataAccess.Data;
using Geesemon.DataAccess.Providers;
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
