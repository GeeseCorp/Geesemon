namespace Geesemon.Web.GraphQL.Types
{
    public class ReceivedMessage
    {
        public Guid ChatId { get; set; }
        public string Text { get; set; }
    }
}
