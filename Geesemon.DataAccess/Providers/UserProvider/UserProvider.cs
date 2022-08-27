﻿using Geesemon.Model.Models;
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

        public virtual Task<User?> GetByLoginAsync(string login, params Expression<Func<User, object>>[] includes)
        {
            return includes.Aggregate(context.Users.AsQueryable(),
                (current, include) => current.Include(include))
                    .FirstOrDefaultAsync(e => e.Login == login);
        }

        public Task<List<User>> GetAsync(Guid chatId)
        {
            return context.Users.Include(c => c.UserChats)
                .Where(c => c.UserChats.Any(uc => uc.ChatId == chatId))
                .ToListAsync();
        }
    }
}
