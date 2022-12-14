using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;

namespace Geesemon.DataAccess.Providers.UsersChatsProvider
{
    public class UserChatProvider : ManyToManyProviderBase<UserChat>, IUserChatProvider
    {

        public UserChatProvider(AppDbContext appDbContext)
            : base(appDbContext)
        {
        }

        public override async Task<UserChat> RemoveAsync(UserChat entity)
        {
            var userChat = await context.UserChats.FirstOrDefaultAsync(uc => uc.UserId == entity.UserId
                && uc.ChatId == entity.ChatId);
            if (userChat == null)
                throw new NullReferenceException("The given record doesn't exist.");
            context.UserChats.Remove(userChat);
            await context.SaveChangesAsync();

            return userChat;
        }

        public async Task<IEnumerable<UserChat>> GetPersonalByUserIdsAsync(Guid userId1, Guid userId2)
        {    
            var chat = await context.Chats
                .Include(c => c.UserChats)
                .FirstOrDefaultAsync(c => c.Type == ChatKind.Personal 
                    && c.UserChats.All(uc => uc.UserId == userId1 || uc.UserId == userId2));
            return chat?.UserChats ?? new List<UserChat>();
        }
        
        public async Task<UserChat?> Get(Guid chatId, Guid userId)
        {    
            return await context.UserChats
                .SingleOrDefaultAsync(uc => uc.ChatId == chatId && uc.UserId == userId);
        }
        
        public async Task<IEnumerable<UserChat>> Get(Guid chatId)
        {    
            return await context.UserChats
                .Where(uc => uc.ChatId == chatId)
                .ToListAsync();
        }
    }
}
