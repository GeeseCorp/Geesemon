using Geesemon.Model.Models;

using Microsoft.EntityFrameworkCore;

namespace Geesemon.DataAccess.Providers.SessionProvider;
public class SessionProvider : ProviderBase<Session>, ISessionProvider
{
    private readonly AppDbContext context;

    public SessionProvider(AppDbContext context) : base(context)
    {
        this.context = context;
    }

    public async Task MakeAllOfflineAsync()
    {
        var sessions = await context.Sessions
            .Where(s => s.IsOnline == true)
            .ToListAsync();
        foreach (var session in sessions)
        {
            session.IsOnline = false;
            await UpdateAsync(session);
        }
    }

    public Task<Session?> GetByTokenAsync(string token)
    {
        return context.Sessions.SingleOrDefaultAsync(s => s.Token == token);
    }

    public Task<List<Session>> GetLastActiveAsync(IEnumerable<Guid> userIds)
    {
        return context.Sessions
            .Where(s => userIds.Contains(s.UserId))
            .OrderByDescending(s => s.LastTimeOnline)
            .GroupBy(s => s.UserId)
            .Select(s => s.First())
            .ToListAsync();
    }

    public Task<Session?> GetLastActiveAsync(Guid userId)
    {
        return context.Sessions
            .OrderByDescending(s => s.LastTimeOnline)
            .FirstOrDefaultAsync(s => s.UserId == userId);
    }

    public async Task RemoveAllForUserAsync(Guid userId)
    {
        var tokens = await GetAsync(t => t.UserId == userId);
        foreach (var token in tokens)
            context.Sessions.Remove(token);
        await context.SaveChangesAsync();
    }

    public async Task RemoveAsync(Guid userId, string token)
    {
        var tokens = await GetAsync(t => t.UserId == userId && t.Token == token);
        foreach (var t in tokens)
            context.Sessions.Remove(t);
        await context.SaveChangesAsync();
    }
}
