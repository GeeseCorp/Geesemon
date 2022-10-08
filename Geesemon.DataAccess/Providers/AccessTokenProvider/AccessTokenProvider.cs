using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;

namespace Geesemon.DataAccess.Providers.AccessTokenProvider;
public class SessionProvider : ProviderBase<Session>, ISessionProvider
{
    private readonly AppDbContext context;

    public SessionProvider(AppDbContext context) : base(context)
    {
        this.context = context;
    }

    public Task<Session?> GetByToken(string token)
    {
        return context.Sessions.SingleOrDefaultAsync(s => s.Token == token);
    }
    
    public Task<Session?> GetLastActive(Guid userId)
    {
        return context.Sessions
            .OrderByDescending(s => s.LastTimeOnline)
            .FirstOrDefaultAsync(s => s.UserId == userId);
    }

    public async Task RemoveAllForUserAsync(Guid userId)
    {
        var tokens = await GetAsync(t => t.UserId == userId);
        foreach(var token in tokens)
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
