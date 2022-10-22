using Geesemon.DataAccess.Providers.SessionProvider;
using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;

namespace Geesemon.DataAccess.Managers
{
    public class SessionManager : SessionProvider, IManager<Session>
    {
        public SessionManager(AppDbContext appContext) 
            : base(appContext)
        { }

        public async Task<IEnumerable<Session>> TerminateAllOthersSessionAsync(Guid currentUserId, string currentSessionToken)
        {
            var sessions = await context.Sessions
                .Where(s => s.UserId == currentUserId && s.Token != currentSessionToken)
                .ToListAsync();
            context.Sessions.RemoveRange(sessions);
            await context.SaveChangesAsync();
            return sessions;
        }
    }
}
