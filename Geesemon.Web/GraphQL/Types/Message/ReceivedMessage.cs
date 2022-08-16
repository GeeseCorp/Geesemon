namespace Geesemon.Web.GraphQL.Types.Message
{
    public class ReceivedMessage
    {
        public string ToId { get; set; }
        public string Content { get; set; }

        public DateTime? SentAt { get; set; }
    }
}
