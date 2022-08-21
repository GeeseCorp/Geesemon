using Geesemon.Model.Common;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Providers
{
    public abstract class ManyToManyProviderBase<T> : IManyToManyProviderBase<T> where T : class
    {
        protected readonly AppDbContext context;

        public ManyToManyProviderBase(AppDbContext context)
        {
            this.context = context;
        }

        public virtual async Task<T> CreateAsync(T entity)
        {
            await context.Set<T>().AddAsync(entity);
            await context.SaveChangesAsync();
            return entity;
        }

        public async Task<IList<T>> CreateManyAsync(IList<T> entities)
        {
            foreach(var entity in entities)
            {
                await context.Set<T>().AddAsync(entity);
            }
            await context.SaveChangesAsync();

            return entities;
        }

        public abstract Task<T> RemoveAsync(T entity);
    }
}
