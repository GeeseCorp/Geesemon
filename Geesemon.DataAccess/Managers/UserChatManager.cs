using Geesemon.DataAccess.Providers;
using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Managers
{
    public class UserChatManager : UserChatProvider
    {
        public UserChatManager(AppDbContext appContext) 
            : base(appContext)
        { }
    }
}
