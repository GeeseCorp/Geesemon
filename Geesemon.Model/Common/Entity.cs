using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Geesemon.Model.Common
{
    public abstract class Entity
    {
        [Key]
        [Column("Id")]
        public Guid Id { get; set; }

        private DateTime createdAt;

        private DateTime updatedAt;

        [Column("CreatedAt")]
        public DateTime CreatedAt { get => DateTime.SpecifyKind(createdAt, DateTimeKind.Utc); set => createdAt = value; }

        [Column("UpdatedAt")]
        public DateTime UpdatedAt { get => DateTime.SpecifyKind(updatedAt, DateTimeKind.Utc); set => updatedAt = value; }
    }
}
