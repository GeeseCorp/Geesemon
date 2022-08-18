using Geesemon.Model.Models;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Data
{
    public interface IUserProvider : IProviderBase<User>
    {
        Task<User?> GetByLoginAsync(string login, params Expression<Func<User, object>>[] includes);
    }
}