using Geesemon.Model.Common;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Providers
{
    public interface IManyToManyProviderBase<T> where T : class
    {
        Task<T> CreateAsync(T entity);

        Task<IList<T>> CreateManyAsync(IList<T> entities);

        abstract Task<T> RemoveAsync(T entity);
    }
}
