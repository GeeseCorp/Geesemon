using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Providers.AccessTokenProvider;
public class AccessTokenProvider : ProviderBase<AccessToken>, IAccessTokenProvider
{
    private readonly AppDbContext context;

    public AccessTokenProvider(AppDbContext context) : base(context)
    {
        this.context = context;
    }

    public async Task RemoveAllForUserAsync(Guid userId)
    {
        var tokens = await GetAsync(t => t.UserId == userId);
        foreach(var token in tokens)
            context.AceessTokens.Remove(token);
        await context.SaveChangesAsync();
    }

    public async Task RemoveAsync(Guid userId, string token)
    {
        var tokens = await GetAsync(t => t.UserId == userId && t.Token == token);
        foreach (var t in tokens)
            context.AceessTokens.Remove(t);
        await context.SaveChangesAsync();
    }
}
