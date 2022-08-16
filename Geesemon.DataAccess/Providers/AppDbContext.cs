using Geesemon.Model.Common;
using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;

namespace Geesemon.DataAccess.Providers
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) 
            : base(options)
        {
            Database.Migrate();
        }

        public DbSet<UserModel> Users { get; set; }

        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            AddTimestamps();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries()
                .Where(x => x.Entity is Entity && (x.State == EntityState.Added || x.State == EntityState.Modified));
            foreach (var entity in entities)
            {
                DateTime now = DateTime.Now;
                if (entity.State == EntityState.Added)
                {
                    ((Entity)entity.Entity).CreatedAt = now;
                    ((Entity)entity.Entity).Id = Guid.NewGuid();
                }
                ((Entity)entity.Entity).UpdatedAt = now;
            }
        }
    }
}
