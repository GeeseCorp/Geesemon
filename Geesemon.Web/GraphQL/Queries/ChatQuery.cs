using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Queries
{
    public class ChatQuery : ObjectGraphType
    {
        public ChatQuery(IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<ListGraphType<ChatType>>, List<Chat>>()
                .Name("Get")
                .ResolveAsync(async context =>
                {
                    var chatManager = context.RequestServices.GetRequiredService<ChatManager>();
                    var userManager = context.RequestServices.GetRequiredService<UserManager>();
                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    var chats = await chatManager.GetAsync(currentUserId);

                    foreach (var chat in chats)
                    {
                        if (chat.Type == ChatKind.Personal)
                        {
                            var oppositeUser = await userManager.GetByIdAsync(chat.UserChats.FirstOrDefault(uc => uc.UserId != currentUserId).UserId);

                            chat.Name = oppositeUser.FirstName + " " + oppositeUser.LastName;
                        }

                        if (chat.Type == ChatKind.Saved)
                        {
                            chat.Name = "Saved Messages";
                        }
                    }

                    return chats;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
