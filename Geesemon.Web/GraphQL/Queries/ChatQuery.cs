using Geesemon.DataAccess.Dapper.Providers;
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;

using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Queries
{
    public class ChatQuery : ObjectGraphType
    {
        public ChatQuery(IHttpContextAccessor httpContextAccessor, ChatManager chatManager, IServiceProvider serviceProvider, UserProvider userProvider)
        {
            Field<NonNullGraphType<ListGraphType<ChatType>>, IEnumerable<Chat>>()
                .Name("Get")
                .Argument<NonNullGraphType<IntGraphType>, int>("Skip", "")
                .Argument<IntGraphType, int?>("Take", "")
                .ResolveAsync(async context =>
                {
                    var skip = context.GetArgument<int>("Skip");
                    var take = context.GetArgument<int?>("Take");

                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    var chats = await chatManager.GetPaginatedForUserAsync(currentUserId, skip, take ?? 30);
                    chats = await chats.MapForUserAsync(currentUserId, serviceProvider);
                    return chats;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<ChatType, Chat?>()
                .Name("GetByIdentifier")
                .Argument<NonNullGraphType<StringGraphType>, string>("Identifier", "")
                .ResolveAsync(async context =>
                {
                    var identifier = context.GetArgument<string>("Identifier");
                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    var currentIdentifier = httpContextAccessor.HttpContext.User.Claims.GetIdentifier();
                    var chat = await chatManager.GetByIdentifierAsync(identifier, currentUserId);
                    if (chat == null)
                    {
                        var user = await userProvider.GetByIdentifierAsync(identifier);
                        if (user == null)
                            return null;

                        var kind = user.Identifier == currentIdentifier ? ChatKind.Saved : ChatKind.Personal;
                        return new Chat().MapWithUser(user, kind);
                    }
                    return await chat.MapForUserAsync(currentUserId, serviceProvider);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
