namespace Geesemon.Web.GraphQL.Types
{
    public class SentMessageInput
    {
        public Guid ChatId { get; set; }
        public string Text { get; set; }
    }
}
