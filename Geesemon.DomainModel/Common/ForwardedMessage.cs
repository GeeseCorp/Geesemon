using Geesemon.Model.Enums;
using Geesemon.Model.Models;

namespace Geesemon.Model.Common;

public class ForwardedMessage
{
    public string? Text { get; set; }
    public MessageKind Type { get; set; } = MessageKind.Regular;

    public Guid? FromId { get; set; }
    public User? From { get; set; }

    public string? FileUrl { get; set; }

    public static ForwardedMessage GetForwardedMessage(Message message)
    {
        return new ForwardedMessage
        {
            Text = message.Text,
            Type = message.Type,
            FromId = message.FromId,
            FileUrl = message.FileUrl,
        };
    }
}
