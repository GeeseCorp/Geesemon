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

        public async Task<List<Message>> GetByChatIdAsync(Guid chatId, int skipMessageCount, int getMessageCount = 30)
        {
            return await context.Messages.FromSqlRaw(@"
                    select * from messages
                    where chatId = {0}
                    order by createdAt desc
                    OFFSET {1} ROWS FETCH NEXT {2} ROWS ONLY", chatId, skipMessageCount, getMessageCount)
                .OrderBy(x => x.CreatedAt)
                //.Where(m => m.ChatId == chatId)
                //.OrderBy(m => m.CreatedAt)
                //.Skip(skipMessageCout)
                //.Take(getMessageCount)
                .ToListAsync();
        }
    }
}
