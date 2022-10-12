using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class SentMessageInputType : InputObjectGraphType<SentMessageInput>
{
    public SentMessageInputType()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("ChatUsername")
            .Resolve(context => context.Source.ChatUsername);
        
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Text")
            .Resolve(context => context.Source.Text);
    }
}

public class SentMessageInput
{
    public string ChatUsername { get; set; }
    public string Text { get; set; }
}
