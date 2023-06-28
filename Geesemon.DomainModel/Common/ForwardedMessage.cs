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

    public MediaKind? MediaKind { get; set; }

    public string? MimeType { get; set; }

    public static ForwardedMessage GetForwardedMessage(Message message)
    {
        if (message.ForwardedMessage != null)
            return message.ForwardedMessage;

        return new ForwardedMessage
        {
            Text = message.Text,
            Type = message.Type,
            FromId = message.FromId,
            FileUrl = message.FileUrl,
            MediaKind = message.MediaKind,
            MimeType = message.MimeType,
        };
    }
}
