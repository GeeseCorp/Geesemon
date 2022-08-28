using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Providers.MessageProvider
{
    public class MessageProvider : ProviderBase<Message>, IMessageProvider
    {
        public MessageProvider(AppDbContext appDbContext)
            : base(appDbContext)
        {
        }

        public async Task<List<Message>> GetByChatIdAsync(Guid chatId, int skipMessageCout, int getMessageCount = 20)
        {
            return await context.Messages
                .Where(m => m.ChatId == chatId)
                .Skip(skipMessageCout)
                .Take(getMessageCount)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();
        }
    }
}
