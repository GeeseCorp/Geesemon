using Geesemon.DataAccess.Providers.ChatProvider;
using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Managers
{
    public class ChatManager : ChatProvider, IManager<Chat>
    {
        public ChatManager(AppDbContext appContext, SessionManager sessionManager) 
            : base(appContext, sessionManager)
        { }
    }
}
