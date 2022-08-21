using Geesemon.DataAccess.Providers;
using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Managers
{
    public class ChatManager : ChatProvider, IManager<Chat>
    {
        public ChatManager(AppDbContext appContext) 
            : base(appContext)
        { }
    }
}
