using Geesemon.Model.Common;
using Geesemon.Model.Enums;

namespace Geesemon.Model.Models;

public class Chat : Entity
{
    public string? Name { get; set; }

    public ChatKind Type { get; set; }

    public string? ImageUrl { get; set; }

    public string ImageColor { get; set; } = "#000000";

    public Guid? CreatorId { get; set; }
    public User? Creator { get; set; }

    public List<Message>? Messages { get; set; }

    public List<UserChat>? UserChats { get; set; }

}