using Geesemon.Model.Common;

namespace Geesemon.Model.Models;
public class Message : Entity
{
    public string Text { get; set; }

    public Guid FromId { get; set; }
    public User From { get; set; }

    public Guid ChatId { get; set; }
    public Chat Chat { get; set; }

    public List<ReadMessage> ReadMessages { get; set; }
}
