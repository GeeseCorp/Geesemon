using Geesemon.Model.Common;
using Geesemon.Model.Enums;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Geesemon.Model.Models;

public class User : Entity
{
    public string FirstName { get; set; }

    public string? LastName { get; set; }

    public string Login { get; set; }

    public string? Description { get; set; }

    public string? Email { get; set; }

    public bool IsEmailConfirmed { get; set; }

    [JsonIgnore]
    public string Password { get; set; }

    public string? PhoneNumber { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public UserRole Role { get; set; }

    public string? ImageUrl { get; set; }

    public string AvatarColor { get; set; } = "#000000";

    [NotMapped]
    public DateTime LastTimeOnline { get; set; }
    [NotMapped]
    public bool IsOnline { get; set; }

    public List<Message>? Messages { get; set; }

    public List<Chat>? AuthoredChats { get; set; }

    public List<UserChat>? UserChats { get; set; }
    public List<Session>? Sessions { get; set; }
}
