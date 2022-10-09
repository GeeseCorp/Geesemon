using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Providers.ChatProvider
{
    public class ChatProvider : ProviderBase<Chat>, IChatProvider
    {
        private readonly SessionManager sessionManager;

        public ChatProvider(AppDbContext appDbContext, SessionManager sessionManager)
            : base(appDbContext)
        {
            this.sessionManager = sessionManager;
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
