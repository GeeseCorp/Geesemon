using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class DeleteMessageInputType : InputObjectGraphType<DeleteMessageInput>
{
    public DeleteMessageInputType()
    {
        Field<NonNullGraphType<GuidGraphType>, Guid>()
            .Name("MessageId")
            .Resolve(context => context.Source.MessageId);
    }
}

public class DeleteMessageInput
{
    public Guid MessageId { get; set; }
}
