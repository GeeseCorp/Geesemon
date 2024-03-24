using Geesemon.Model.Common;
using Geesemon.Model.Enums;

using System.ComponentModel.DataAnnotations.Schema;

namespace Geesemon.Model.Models;

[Table("Messages")]
public class Message : Entity
{
    [Column("Text")]
    public string? Text { get; set; }

    [Column("Type")]
    public MessageKind Type { get; set; } = MessageKind.Regular;

    [Column("IsEdited")]
    public bool IsEdited { get; set; } = false;

    [NotMapped]
    public int ReadByCount { get; set; }

    [Column("FromId")]
    public Guid? FromId { get; set; }

    [DapperNotMapped]
    public User? From { get; set; }

    [Column("ChatId")]
    public Guid ChatId { get; set; }

    [DapperNotMapped]
    public Chat? Chat { get; set; }

    [Column("ReplyMessageId")]
    public Guid? ReplyMessageId { get; set; }

    [DapperNotMapped]
    public Message? ReplyMessage { get; set; }

    [DapperNotMapped]
    public IEnumerable<Message>? RepliedMessages { get; set; }

    [Column("FileUrl")]
    public string? FileUrl { get; set; }

    [Column("MediaKind")]
    public MediaKind? MediaKind { get; set; }

    [Column("MimeType")]
    public string? MimeType { get; set; }

    [DapperNotMapped]
    public List<ReadMessage>? ReadBy { get; set; }

    [Column("ForwardedMessage")]
    public ForwardedMessage? ForwardedMessage { get; set; }

    [Column("GeeseTextArguments")]
    public string[] GeeseTextArguments { get; set; } = Array.Empty<string>();
}
