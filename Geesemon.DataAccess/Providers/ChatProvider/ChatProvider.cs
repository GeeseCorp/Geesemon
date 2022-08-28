using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Providers.ChatProvider
{
    public class ChatProvider : ProviderBase<Chat>, IChatProvider
    {
        public ChatProvider(AppDbContext appDbContext)
            : base(appDbContext)
        {
        }

        public Task<List<Chat>> GetAsync(Guid userId)
        {
            return context.Chats.Include(c => c.UserChats)
                .Where(c => c.UserChats.Any(uc => uc.UserId == userId))
                .ToListAsync();
        }
    }
}
