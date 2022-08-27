using Geesemon.Model.Models;

namespace Geesemon.Web.Services.MessageSubscription;

public class MessageAction
{
    public MessageActionKind Type { get; set; }

    public Message Message { get; set; }
}
