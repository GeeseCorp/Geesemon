using Geesemon.Web.GeeseTexts;
using Geesemon.Web.Services.FileManagers;

using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class LanguageType : ObjectGraphType<Language>
{
    public LanguageType(IFileManagerService fileManagerService)
    {
        Field<NonNullGraphType<StringGraphType>>()
            .Name("Code")
            .Resolve(context => context.Source.Code.ToString());

        Field<NonNullGraphType<StringGraphType>>()
            .Name("Name")
            .Resolve(context => context.Source.Name);

        Field<NonNullGraphType<StringGraphType>>()
            .Name("FlagUrl")
            .Resolve(context => fileManagerService.FormatUrl(context.Source.FlagUrl));
    }
}

