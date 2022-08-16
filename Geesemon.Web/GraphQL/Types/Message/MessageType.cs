using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types.Message
{
    public class MessageType : ObjectGraphType<Geesemon.Model.Models.Message>
    {
        public MessageType()
        {
            Field(o => o.Content);
            Field(o => o.SentAt, type: typeof(DateTimeGraphType));
            Field(o => o.FromId);
            Field(o => o.ToId);
        }
    }
}
