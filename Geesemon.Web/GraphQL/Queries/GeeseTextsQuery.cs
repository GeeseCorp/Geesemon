using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using Geesemon.Web.Geesetext;
using Geesemon.Web.GeeseTexts;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using GraphQL;
using GraphQL.Types;
using Microsoft.Net.Http.Headers;

namespace Geesemon.Web.GraphQL.Queries
{
    public class GeeseTextsQuery : ObjectGraphType
    {
        public GeeseTextsQuery(IHttpContextAccessor httpContextAccessor, GeeseTextsAccessor geeseTextsAccessor)
        {
            Field<ListGraphType<GeeseTextType>, List<GeeseText>>()
                .Name("GetTexts")
                .Resolve(context =>
                {
                   if(!httpContextAccessor.HttpContext.Request.Cookies.TryGetValue("lang", out string? lang))
                        return geeseTextsAccessor.GetTexts(Language.EN);

                    if(Enum.TryParse<Language>(lang, true, out var language ))
                        return geeseTextsAccessor.GetTexts(language);

                    return geeseTextsAccessor.GetTexts(Language.EN);
                });

            Field<ListGraphType<GeeseTextType>, List<GeeseText>>()
                .Name("GetLanguages")
                .Resolve(context =>
                {
                    return GeeseTextsAccessor.LanguagesTexts;
                });
        }
    }
}
