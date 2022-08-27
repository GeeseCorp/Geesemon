using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class CreatePersonalChatInputType : InputObjectGraphType<CreatePersonalChatInput>
{
    public CreatePersonalChatInputType()
    {

        Field<NonNullGraphType<GuidGraphType>, Guid>()
            .Name("UserId");
    }
}

public class CreatePersonalChatInput
{
    public Guid UserId { get; set; }
}
