using Geesemon.Model.Models;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Providers.UserProvider
{
    public interface IUserProvider : IProviderBase<User>
    {
        Task<User?> GetByLoginAsync(string login, params Expression<Func<User, object>>[] includes);
        Task<List<User>> GetAsync(Guid chatId);
        Task<List<User>> GetAsync(int take, int skip, string q);
    }
}