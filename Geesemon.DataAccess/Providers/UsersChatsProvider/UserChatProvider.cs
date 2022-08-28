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
    }
}
