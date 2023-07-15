namespace Geesemon.Model.GrapghQL.Chat;

public class ChatsAddMembersInput
{
    public Guid ChatId { get; set; }
    public IEnumerable<Guid> UserIds { get; set; }
}
