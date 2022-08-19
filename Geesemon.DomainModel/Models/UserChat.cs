using Geesemon.Model.Common;

namespace Geesemon.Model.Models;
public class UserChat : Entity
{
    public Guid ChatId { get; set; }
    public Chat Chat { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }
}
