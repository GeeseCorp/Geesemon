using Geesemon.Model.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Geesemon.Model.Models;
public class ReadMessage
{
    [Key, Column(Order = 0)]
    public Guid MessageId { get; set; }
    public Message? Message { get; set; }

    [Key, Column(Order = 1)]
    public Guid ReadById { get; set; }
    public User? ReadBy { get; set; }
}
