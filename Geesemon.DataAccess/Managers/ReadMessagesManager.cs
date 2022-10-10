using Geesemon.DataAccess.Providers.ReadMessageProvider;

namespace Geesemon.DataAccess.Managers
{
    public class ReadMessagesManager : ReadMessageProvider
    {
        public ReadMessagesManager(AppDbContext appContext) 
            : base(appContext)
        { }
    }
}
