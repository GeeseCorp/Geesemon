using Geesemon.DataAccess.Providers.MessageProvider;
using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Managers
{
    public class MessageManager : MessageProvider, IManager<Message>
    {
        public MessageManager(AppDbContext appContext) 
            : base(appContext)
        { }
    }
}
