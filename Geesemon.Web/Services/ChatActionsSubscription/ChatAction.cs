using Geesemon.Model.Models;

namespace Geesemon.Web.Services.ChatActionsSubscription;

public class ChatAction
{
    public ChatActionKind Type { get; set; }

    public Chat Chat { get; set; }
    public Guid ForUserId { get; set; }
}
