using Geesemon.Model.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Geesemon.Model.Models;
public class ReadMessage : Entity
{
    public Guid MessageId { get; set; }
    public Message Message { get; set; }

    public Guid ReadById { get; set; }
    public User ReadBy { get; set; }
}
