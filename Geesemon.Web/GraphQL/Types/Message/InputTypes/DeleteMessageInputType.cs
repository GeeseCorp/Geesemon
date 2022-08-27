using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class DeleteMessageInputType : InputObjectGraphType<DeleteMessageInput>
{
    public DeleteMessageInputType()
    {
        Field<NonNullGraphType<GuidGraphType>>("MessageId");
    }
}
