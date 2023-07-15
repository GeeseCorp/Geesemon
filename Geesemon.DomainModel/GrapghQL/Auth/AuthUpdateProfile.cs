using Microsoft.AspNetCore.Http;

namespace Geesemon.Model.GrapghQL.Auth;

public class AuthUpdateProfile
{
    public string Firstname { get; set; }
    public string? Lastname { get; set; }
    public string Identifier { get; set; }
    public string? ImageUrl { get; set; }
    public IFormFile? Image { get; set; }
}
