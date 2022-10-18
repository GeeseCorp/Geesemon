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
        public ChatQuery(IHttpContextAccessor httpContextAccessor, ChatManager chatManager, IServiceProvider serviceProvider, UserManager userManager)
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
                .Name("GetByUsername")
                .Argument<NonNullGraphType<StringGraphType>, string>("Username", "")
                .ResolveAsync(async context =>
                {
                    var username = context.GetArgument<string>("Username");
                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    var currentUsername = httpContextAccessor.HttpContext.User.Claims.GetUsername();
                    var chat = await chatManager.GetByUsernameAsync(username, currentUserId);
                    if(chat == null)
                    {
                        var user = await userManager.GetByUsernameAsync(username);
                        if (user == null)
                            return null;

                        var kind = user.Username == currentUsername ? ChatKind.Saved : ChatKind.Personal;
                        return new Chat().MapWithUser(user, kind);
                    }
                    return await chat.MapForUserAsync(currentUserId, serviceProvider);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
