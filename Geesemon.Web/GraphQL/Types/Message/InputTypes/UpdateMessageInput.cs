namespace Geesemon.Web.GraphQL.Types
{
    public class UpdateMessageInput
    {
        public Guid MessageId { get; set; }

        public string Text { get; set; }
    }
}
