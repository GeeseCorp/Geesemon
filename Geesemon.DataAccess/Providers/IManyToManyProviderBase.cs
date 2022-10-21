namespace Geesemon.DataAccess.Providers
{
    public interface IManyToManyProviderBase<T> where T : class
    {
        Task<T> CreateAsync(T entity);

        Task<IEnumerable<T>> CreateManyAsync(IEnumerable<T> entities);

        abstract Task<T> RemoveAsync(T entity);
    }
}
