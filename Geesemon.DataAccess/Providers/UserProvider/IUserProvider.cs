using Geesemon.Model.Models;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Data
{
    public interface IUserProvider : IProviderBase<UserModel>
    {
        Task<UserModel?> GetByLoginAsync(string login, params Expression<Func<UserModel, object>>[] includes);
    }
}