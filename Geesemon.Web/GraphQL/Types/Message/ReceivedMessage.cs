namespace Geesemon.Web.GraphQL.Types.Message
{
    public class ReceivedMessage
    {
        public Guid ChatId { get; set; }
        public string Text { get; set; }
    }
}
