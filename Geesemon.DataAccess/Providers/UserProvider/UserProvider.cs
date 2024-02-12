//using Geesemon.Model.Models;

//using Microsoft.EntityFrameworkCore;

//using System.Linq.Expressions;

//namespace Geesemon.DataAccess.Providers.UserProvider
//{
//    public class UserProvider : ProviderBase<User>
//    {

//        public UserProvider(AppDbContext appDbContext)
//            : base(appDbContext)
//        {
//        }

//        public Task<List<User>> GetReadByAsync(Guid messageId, int skip, int take)
//        {
//            return context.ReadMessages
//                .Include(rm => rm.ReadBy)
//                .Where(rm => rm.MessageId == messageId)
//                .OrderByDescending(rm => rm.CreatedAt)
//                .Skip(skip)
//                .Take(take)
//                .Select(rm => rm.ReadBy)
//                .ToListAsync();
//        }

//        public Task<int> GetReadByCountByAsync(Guid messageId)
//        {
//            return context.ReadMessages
//                .CountAsync(rm => rm.MessageId == messageId);
//        }

//        public virtual Task<User?> GetByIdentifierAsync(string identifier, params Expression<Func<User, object>>[] includes)
//        {
//            return includes.Aggregate(context.Users.AsQueryable(),
//                (current, include) => current.Include(include))
//                    .FirstOrDefaultAsync(e => e.Identifier == identifier);
//        }

//        public virtual Task<User?> GetByEmailAsync(string email, params Expression<Func<User, object>>[] includes)
//        {
//            return includes.Aggregate(context.Users.AsQueryable(),
//                (current, include) => current.Include(include))
//                    .FirstOrDefaultAsync(e => e.Email == email);
//        }

//        public Task<List<User>> GetAsync(Guid chatId)
//        {
//            return context.Users.Include(c => c.UserChats)
//                .Where(c => c.UserChats.Any(uc => uc.ChatId == chatId))
//                .ToListAsync();
//        }

//        public Task<List<User>> GetAsync(int take, int skip, string q, Guid? currentUserId = null)
//        {
//            return context.Users
//                .Where(u => (u.Identifier.Contains(q) || (u.Email != null && u.Email.Contains(q))) && u.Id != currentUserId)
//                .OrderBy(u => u.FirstName)
//                .ThenBy(u => u.LastName)
//                .Skip(skip)
//                .Take(take)
//                .ToListAsync();
//        }
//    }
//}
