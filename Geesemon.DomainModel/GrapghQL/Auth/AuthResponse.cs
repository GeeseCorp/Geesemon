using Geesemon.Model.Models;

namespace Geesemon.Model.GrapghQL.Auth;

public class AuthResponse
{
    public User User { get; set; }
    public string Token { get; set; }
    public Session Session { get; set; }
}