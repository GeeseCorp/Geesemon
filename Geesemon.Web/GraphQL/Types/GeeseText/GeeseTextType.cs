using Geesemon.Web.GeeseTexts;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class GeeseTextType : ObjectGraphType<GeeseText>
{
    public GeeseTextType()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Key")
            .Resolve(context => context.Source.Key);

        Field<NonNullGraphType<StringGraphType>, string?>()
            .Name("Value")
            .Resolve(context => context.Source.Value);
    }
}

