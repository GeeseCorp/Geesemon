using Geesemon.Model.Common;
using Geesemon.Model.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Geesemon.Model.Models;
public class Message : Entity
{
    public string? Text { get; set; }
    public MessageKind Type { get; set; }
    public bool IsEdited { get; set; } = false;

    [NotMapped]
    public int ReadByCount { get; set; }

    public Guid? FromId { get; set; }
    public User? From { get; set; }

    public Guid ChatId { get; set; }
    public Chat? Chat { get; set; }
    
    public Guid? ReplyMessageId { get; set; }
    public Message? ReplyMessage { get; set; }
    public IEnumerable<Message>? RepliedMessages { get; set; }

    public List<ReadMessage>? ReadBy { get; set; }
}
