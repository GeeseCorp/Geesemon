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

        public Task<List<Chat>> GetAllForUserAsync(Guid userId)
        {
            return context.Chats
                .Include(c => c.UserChats)
                .Where(c => c.UserChats.Any(uc => uc.UserId == userId))
                .ToListAsync();
        }

        public Task<List<Chat>> GetPaginatedForUserAsync(Guid userId, int skipMessageCount, int takeMessageCount = 30)
        {
            return context.Chats
                .Include(c => c.UserChats)
                .Include(c => c.Messages)
                .Where(c => c.UserChats.Any(uc => uc.UserId == userId))
                .OrderByDescending(c => c.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault() != null ? c.Messages.OrderByDescending(m => m.CreatedAt).First().CreatedAt : c.CreatedAt)
                .Skip(skipMessageCount)
                .Take(takeMessageCount)
                .ToListAsync();
        }

        public async Task<bool> IsUserInChat(Guid userId, Guid chatId)
        {
            var chat = await context.Chats.Include(c => c.UserChats)
                .FirstOrDefaultAsync(c => c.Id == chatId && c.UserChats.Any(uc => uc.UserId == userId));

            return chat != null;
        }
    }
}
