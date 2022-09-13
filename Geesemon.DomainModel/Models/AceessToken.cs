using Geesemon.Model.Common;

namespace Geesemon.Model.Models;
public class AccessToken : Entity
{
    public string Token { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
}
