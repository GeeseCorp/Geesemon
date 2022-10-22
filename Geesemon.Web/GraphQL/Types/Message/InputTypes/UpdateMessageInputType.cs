using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class UpdateMessageInputType : InputObjectGraphType<UpdateMessageInput>
{
    public UpdateMessageInputType()
    {
        Field<NonNullGraphType<GuidGraphType>, Guid>()
            .Name("MessageId")
            .Resolve(context => context.Source.MessageId);

        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Text")
            .Resolve(context => context.Source.Text);
    }
}

public class UpdateMessageInput
{
    public Guid MessageId { get; set; }
    public string Text { get; set; }
}
