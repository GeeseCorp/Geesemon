using Geesemon.Model.Common;
using Geesemon.Model.Enums;

namespace Geesemon.Model.Models;
public class Message : Entity
{
    public string? Text { get; set; }

    public MessageKind Type { get; set; }

    public Guid? FromId { get; set; }
    public User? From { get; set; }

    public Guid ChatId { get; set; }
    public Chat? Chat { get; set; }

    public bool IsEdited { get; set; } = false;

    public List<ReadMessage>? ReadBy { get; set; }
}
