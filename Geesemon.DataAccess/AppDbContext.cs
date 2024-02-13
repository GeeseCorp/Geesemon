using Geesemon.Model.Common;
using Geesemon.Model.Models;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

using Newtonsoft.Json;

namespace Geesemon.DataAccess
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
            //Database.Migrate();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<ReadMessage> ReadMessages { get; set; }
        public DbSet<UserChat> UserChats { get; set; }
        public DbSet<Session> Sessions { get; set; }

        public const string DefaultConnectionString = "Data Source=localhost;Initial Catalog=GeesemonDB_dev;Integrated Security=True;Connect Timeout=60;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False;";

        public override int SaveChanges()
        {
            InitEntities();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            InitEntities();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void InitEntities()
        {
            var rnd = new Random();
            var entities = ChangeTracker.Entries()
                .Where(x => x.Entity is Entity && (x.State == EntityState.Added || x.State == EntityState.Modified));
            foreach (var entityEntry in entities)
            {
                var entity = entityEntry.Entity as Entity;
                var now = DateTime.UtcNow;
                if (entityEntry.State == EntityState.Added)
                {
                    entity.CreatedAt = now;

                    if (entity.Id == Guid.Empty)
                        entity.Id = Guid.NewGuid();
                }
                entity.UpdatedAt = now;

                if (entity is Chat)
                {
                    var chat = (Chat)entity;
                    chat.ImageColor = ColorGenerator.GetRandomColor();
                }

                if (entity is User)
                {
                    var user = (User)entity;
                    user.AvatarColor = ColorGenerator.GetRandomColor();
                }
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ReadMessage>()
                .HasKey(c => new { c.ReadById, c.MessageId });

            modelBuilder.Entity<UserChat>()
                .HasKey(c => new { c.UserId, c.ChatId });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Identifier).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            modelBuilder.Entity<Message>()
                .HasOne(m => m.From)
                .WithMany(u => u.Messages)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Message>()
                .HasMany(m => m.RepliedMessages)
                .WithOne(m => m.ReplyMessage)
                .HasForeignKey(x => x.ReplyMessageId)
                .OnDelete(DeleteBehavior.ClientSetNull);

            modelBuilder.Entity<Message>()
                .Property(e => e.ForwardedMessage).HasConversion(
                    v => JsonConvert.SerializeObject(v, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }),
                    v => JsonConvert.DeserializeObject<ForwardedMessage>(v, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore }));

            modelBuilder.Entity<Message>()
                .Property(x => x.GeeseTextArguments)
                .HasConversion(new ValueConverter<string[], string>(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<string[]>(v) ?? new string[0]));

            modelBuilder.Entity<Chat>()
                .HasOne(c => c.Creator)
                .WithMany(u => u.AuthoredChats)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Session>(entity =>
            {
                entity.HasIndex(e => e.Token).IsUnique();
            });
        }

        public static readonly List<string> colors = new List<string>()
        {
            "#1abc9c", "#2ecc71", "#3498db", "#9b59b6",
            "#16a085", "#27ae60", "#2980b9", "#8e44ad",
            "#f1c40f", "#e67e22", "#e74c3c", "#f39c12",
            "#d35400", "#c0392b", "#6ab04c", "#be2edd",
        };
    }
}
