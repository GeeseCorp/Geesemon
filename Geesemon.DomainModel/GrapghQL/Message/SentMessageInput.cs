using Geesemon.Model.Enums;
using Microsoft.AspNetCore.Http;

namespace Geesemon.Model.GrapghQL.Message;

public class SentMessageInput
{
    public string Identifier { get; set; }
    public string? Text { get; set; }
    public Guid? ReplyMessageId { get; set; }
    public IEnumerable<IFormFile> Files { get; set; } = new List<IFormFile>();
    public IEnumerable<Guid> ForwardedMessageIds { get; set; } = new List<Guid>();
    public MediaKind? MediaKind { get; set; }
}