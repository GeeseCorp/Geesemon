using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;

namespace Geesemon.DataAccess.Providers.MessageProvider
{
    public class MessageProvider : ProviderBase<Message>, IMessageProvider
    {
        public MessageProvider(AppDbContext appDbContext)
            : base(appDbContext)
        {
        }

        public async Task<int> GetNotReadMessagesCount(Guid chatId, Guid currentUserId)
        {
            return await context.Messages
                .Include(m => m.ReadBy)
                .CountAsync(m => m.ChatId == chatId && m.FromId != currentUserId && !m.ReadBy.Any(rb => rb.ReadById == currentUserId));
        }
        
        public async Task<List<Message>> GetByChatIdAsync(Guid chatId, int skipMessageCount, int getMessageCount = 30)
        {
            return await context.Messages
                .Where(m => m.ChatId == chatId)
                .OrderByDescending(m => m.CreatedAt)
                .Skip(skipMessageCount)
                .Take(getMessageCount)
                //.OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }
    }
}
