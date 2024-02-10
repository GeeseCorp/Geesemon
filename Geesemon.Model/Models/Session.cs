using Geesemon.Model.Common;

namespace Geesemon.Model.Models;
public class Session : Entity
{
    public string Token { get; set; }
    public bool IsOnline { get; set; }
    public DateTime LastTimeOnline { get; set; }
    public string IpAddress { get; set; }
    public string UserAgent { get; set; }
    public string Location { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }
}
