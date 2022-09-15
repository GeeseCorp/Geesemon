using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

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

        // TODO: huge lox must fix this method!!!
        public async Task<List<UserChat>> GetPersonalByUserIds(params Guid[] userIds)
        {    
            var chat = await context.Chats.Include(uc => uc.UserChats)
                .FirstOrDefaultAsync(c => (c.Type == ChatKind.Personal || c.Type == ChatKind.Saved) && c.UserChats
                .All(uc => userIds.Contains(uc.UserId)));

            return chat?.UserChats ?? new List<UserChat>();
        }
    }
}
