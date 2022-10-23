using Geesemon.Model.Models;

namespace Geesemon.Web.Services.ChatActionsSubscription;

public class ChatMembers
{
    public User User { get; set; }
    public ChatMembersKind Type { get; set; }
    public Guid ChatId { get; set; }
}
