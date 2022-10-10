using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;

namespace Geesemon.DataAccess.Providers.ReadMessageProvider
{
    public class ReadMessageProvider : ManyToManyProviderBase<ReadMessage>, IReadMessageProvider
    {

        public ReadMessageProvider(AppDbContext appDbContext)
            : base(appDbContext)
        {
        }

        public override async Task<ReadMessage> RemoveAsync(ReadMessage entity)
        {
            var readMessage = await context.ReadMessages.FirstOrDefaultAsync(rm => rm.ReadById == entity.ReadById
                && rm.MessageId == entity.MessageId);
            if (readMessage == null)
                throw new NullReferenceException("The given record doesn't exist.");

            context.ReadMessages.Remove(readMessage);
            await context.SaveChangesAsync();
            return readMessage;
        }
    }
}
