using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class SentMessageInputType : InputObjectGraphType<SentMessageInput>
{
    public SentMessageInputType()
    {
        Field<NonNullGraphType<GuidGraphType>>("ChatId");
        Field<NonNullGraphType<StringGraphType>>("Text");
    }
}
