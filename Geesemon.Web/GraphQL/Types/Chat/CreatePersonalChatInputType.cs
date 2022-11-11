using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class CreatePersonalChatInputType : InputObjectGraphType<CreatePersonalChatInput>
{
    public CreatePersonalChatInputType()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Identifier")
            .Resolve(context => context.Source.Identifier);
    }
}

public class CreatePersonalChatInput
{
    public string Identifier { get; set; }
}
