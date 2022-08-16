using Geesemon.DataAccess.Providers;
using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Data
{
    public class UserProvider : ProviderBase<UserModel>, IUserProvider
    {

        public UserProvider(AppDbContext appDbContext)
            : base(appDbContext)
        {
        }

        public virtual Task<UserModel?> GetByLoginAsync(string login, params Expression<Func<UserModel, object>>[] includes)
        {
            return includes.Aggregate(context.Users.AsQueryable(),
                (current, include) => current.Include(include))
                    .FirstOrDefaultAsync(e => e.Login == login);
        }
    }
}
