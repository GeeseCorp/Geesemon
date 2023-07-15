namespace Geesemon.Model.GrapghQL.Message;

public class DeleteMessageInput
{
    public IEnumerable<Guid> MessageIds { get; set; }
}