using Microsoft.AspNetCore.Http;

namespace Geesemon.Model.GrapghQL.Chat;

public class CreateGroupChatInput
{
    public List<Guid> UsersId { get; set; }
    public string Name { get; set; }
    public string Identifier { get; set; }
    public IFormFile Image { get; set; }
}