using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Providers.UserProvider
{
    public class UserProvider : ProviderBase<User>, IUserProvider
    {

        public UserProvider(AppDbContext appDbContext)
            : base(appDbContext)
        {
        }

        public async Task<IEnumerable<User>> GetByMessageIdAsync(Guid messageId, int skip, int take)
        {
            return await context.Users
                .Include(u => u.ReadMessages)
                .Where(u => u.ReadMessages.Any(r => r.MessageId == messageId))
                .OrderByDescending(u => u.ReadMessages.FirstOrDefault(rm => rm.MessageId == messageId).CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
        
        public async Task<int> GetCountByMessageIdAsync(Guid messageId)
        {
            return await context.Users
                .Include(u => u.ReadMessages)
                .CountAsync(u => u.ReadMessages.Any(r => r.MessageId == messageId));
        }

        public virtual Task<User?> GetByLoginAsync(string login, params Expression<Func<User, object>>[] includes)
        {
            return includes.Aggregate(context.Users.AsQueryable(),
                (current, include) => current.Include(include))
                    .FirstOrDefaultAsync(e => e.Login == login);
        }

        public virtual Task<User?> GetByEmailAsync(string email, params Expression<Func<User, object>>[] includes)
        {
            return includes.Aggregate(context.Users.AsQueryable(),
                (current, include) => current.Include(include))
                    .FirstOrDefaultAsync(e => e.Email == email);
        }

        public Task<List<User>> GetAsync(Guid chatId)
        {
            return context.Users.Include(c => c.UserChats)
                .Where(c => c.UserChats.Any(uc => uc.ChatId == chatId))
                .ToListAsync();
        }

        public Task<List<User>> GetAsync(int take, int skip, string q)
        {
            return context.Users
                .Where(u => u.Login.Contains(q) || u.Email.Contains(q))
                .OrderBy(u => u.FirstName)
                .ThenBy(u => u.LastName)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
    }
}
