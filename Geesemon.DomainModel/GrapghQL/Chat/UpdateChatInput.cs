using Microsoft.AspNetCore.Http;

namespace Geesemon.Model.GrapghQL.Chat;

public class UpdateChatInput
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Identifier { get; set; }

    public IFormFile Image { get; set; }
}