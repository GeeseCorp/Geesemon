using Geesemon.Web.Geesetext;
using Geesemon.Web.GeeseTexts;
using Geesemon.Web.GraphQL.Types;

using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Queries
{
    public class GeeseTextsQuery : ObjectGraphType
    {
        public GeeseTextsQuery(IHttpContextAccessor httpContextAccessor, GeeseTextsAccessor geeseTextsAccessor)
        {
            Field<NonNullGraphType<ListGraphType<GeeseTextType>>, List<GeeseText>>()
                .Name("GetTexts")
                .Resolve(context =>
                {
                    if (!httpContextAccessor.HttpContext.Request.Cookies.TryGetValue("lang", out string? lang))
                        return geeseTextsAccessor.GetTexts(LanguageCode.EN);

                    if (Enum.TryParse<LanguageCode>(lang, true, out var language))
                        return geeseTextsAccessor.GetTexts(language);

                    return geeseTextsAccessor.GetTexts(LanguageCode.EN);
                });

            Field<NonNullGraphType<ListGraphType<LanguageType>>, List<Language>>()
                .Name("GetLanguages")
                .Resolve(context => GeeseTextsAccessor.Languages);
        }
    }
}
