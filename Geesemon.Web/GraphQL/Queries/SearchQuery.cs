using Geesemon.Common;
using Geesemon.DataAccess.Managers;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Common;
using Geesemon.Web.GraphQL.Types;

using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Queries;

public class SearchQuery : ObjectGraphType
{
    public SearchQuery(IHttpContextAccessor httpContextAccessor, ChatManager chatManager, IServiceProvider serviceProvider)
    {
        Field<NonNullGraphType<ListGraphType<ChatType>>>()
               .Name("Chats")
               .Argument<NonNullGraphType<StringGraphType>>("keywords")
               .Argument<NonNullGraphType<PagingType>>("paging")
               .ResolveAsync(async context =>
               {
                   var keywords = context.GetArgument<string>("keywords");
                   var paging = context.GetArgument<Paging>("paging");

                   var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

                   var chats = await chatManager.Search(keywords, currentUserId, paging);
                   return await chats.MapForUserAsync(currentUserId, serviceProvider);
               })
               .AuthorizeWith(AuthPolicies.Authenticated);
    }
}
