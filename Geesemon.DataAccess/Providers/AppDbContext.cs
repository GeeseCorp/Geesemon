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

        public DbSet<User> Users { get; set; }

        public DbSet<Chat> Chats { get; set; }

        public DbSet<Message> Messages { get; set; }

        public DbSet<ReadMessage> ReadMessages { get; set; }

        public DbSet<UserChat> UserChats { get; set; }

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
                DateTime now = DateTime.UtcNow;
                if (entity.State == EntityState.Added)
                {
                    var initialEntity = entity.Entity as Entity;

                    initialEntity.CreatedAt = now;

                    if(initialEntity.Id == Guid.Empty)
                        initialEntity.Id = Guid.NewGuid();
                }
                ((Entity)entity.Entity).UpdatedAt = now;
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ReadMessage>()
                .HasKey(c => new { c.ReadById, c.MessageId });

            modelBuilder.Entity<UserChat>()
                .HasKey(c => new { c.UserId, c.ChatId });

            modelBuilder.Entity<User>(entity => {
                entity.HasIndex(e => e.Login).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            modelBuilder.Entity<Message>()
                .HasOne(m => m.From)
                .WithMany(u => u.Messages)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Chat>()
                .HasOne(c => c.Creator)
                .WithMany(u => u.AuthoredChats)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
