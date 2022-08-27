using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class UpdateMessageInputType : InputObjectGraphType<UpdateMessageInput>
{
    public UpdateMessageInputType()
    {
        Field<NonNullGraphType<GuidGraphType>>("MessageId");

        Field<NonNullGraphType<StringGraphType>>("Text");
    }
}
