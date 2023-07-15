namespace Geesemon.Model.GrapghQL.Message;

public class UpdateMessageInput
{
    public Guid MessageId { get; set; }
    public string Text { get; set; }
}