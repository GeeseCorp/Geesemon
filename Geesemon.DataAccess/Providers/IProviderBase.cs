using Geesemon.Model.Common;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Providers
{
    public interface IProviderBase<T> where T : Entity
    {
        Task<T?> GetByIdAsync(Guid? id, params Expression<Func<T, object>>[] includes);
        Task<List<T>> GetAsync(params Expression<Func<T, object>>[] includes);
        Task<List<T>> GetAsync(Expression<Func<T, bool>> condition, params Expression<Func<T, object>>[] includes);
        Task<T> CreateAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task<T> RemoveAsync(Guid id);
    }
}
