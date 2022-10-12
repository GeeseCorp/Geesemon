using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class CreatePersonalChatInputType : InputObjectGraphType<CreatePersonalChatInput>
{
    public CreatePersonalChatInputType()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Username")
            .Resolve(context => context.Source.Username);
    }
}

public class CreatePersonalChatInput
{
    public string Username { get; set; }
}
