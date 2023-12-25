using Geesemon.Web.GeeseTexts;

using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class LanguageType : ObjectGraphType<Language>
{
    public LanguageType()
    {
        Field<NonNullGraphType<StringGraphType>>()
            .Name("Code")
            .Resolve(context => context.Source.Code.ToString());

        Field<NonNullGraphType<StringGraphType>>()
            .Name("Name")
            .Resolve(context => context.Source.Name);

        Field<NonNullGraphType<StringGraphType>>()
            .Name("FlagUrl")
            .Resolve(context => context.Source.FlagUrl);
    }
}

