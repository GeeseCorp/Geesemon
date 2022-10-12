using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;

namespace Geesemon.DataAccess.Providers.ChatProvider
{
    public class ChatProvider : ProviderBase<Chat>, IChatProvider
    {

        public ChatProvider(AppDbContext appDbContext)
            : base(appDbContext)
        {
        }

        public async Task<Chat?> GetByUsername(string chatUsername, Guid currentUserId)
        {
            return await context.Chats
                .Include(c => c.UserChats)
                .ThenInclude(uc => uc.User)
                .FirstOrDefaultAsync(c => c.Type == ChatKind.Personal
                    ? c.UserChats.Any(uc => uc.User.Username == chatUsername && uc.UserId != currentUserId)
                    : c.Type == ChatKind.Saved
                        ? c.UserChats.Any(uc => uc.User.Username == chatUsername && uc.UserId == currentUserId)
                        : c.Username == chatUsername && c.UserChats.Any(uc => uc.UserId == currentUserId));
        }
        
        public async Task<int> GetMembersTotalAsync(Guid chatId)
        {
            var chat = context.Chats.Find(chatId);
            return await context.Entry(chat)
                .Collection(c => c.UserChats)
                .Query()
                .CountAsync();
        }

        public async Task<int> GetMembersOnlineAsync(Guid chatId)
        {
            return await context.Chats
                .Include(c => c.UserChats)
                .ThenInclude(uc => uc.User)
                .ThenInclude(u => u.Sessions)
                .Where(c => c.Id == chatId)
                .SelectMany(c => c.UserChats)
                .Select(uc => uc.User)
                .Select(u => u.Sessions.OrderByDescending(s => s.LastTimeOnline).FirstOrDefault())
                .CountAsync(s => s.IsOnline == true);
        }
        
        public async Task<IEnumerable<Chat>> GetAllForUserAsync(Guid userId)
        {
            return await context.Chats
                .Include(c => c.UserChats)
                .Where(c => c.UserChats.Any(uc => uc.UserId == userId))
                .ToListAsync();
        }

        public async Task<IEnumerable<Chat>> GetPaginatedForUserAsync(Guid userId, int skipMessageCount, int takeMessageCount = 30)
        {
            return await context.Chats
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
