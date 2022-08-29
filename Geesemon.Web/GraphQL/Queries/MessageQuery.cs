using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Queries
{
    public class MessageQuery : ObjectGraphType
    {
        public MessageQuery(IHttpContextAccessor httpContextAccessor, ChatManager chatManager, MessageManager messageManager)
        {
            Field<NonNullGraphType<ListGraphType<MessageType>>, List<Message>>()
                .Name("Get")
                .Argument<NonNullGraphType<GuidGraphType>, Guid>("ChatId", "Id of the chat.")
                .Argument<NonNullGraphType<IntGraphType>, int>("Skip", "")
                .Argument<IntGraphType, int?>("Take", "")
                .ResolveAsync(async context =>
                {
                    var chatId = context.GetArgument<Guid>("ChatId");
                    var skip = context.GetArgument<int>("Skip");
                    var take = context.GetArgument<int?>("Take");

                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    var chat = await chatManager.GetByIdAsync(chatId);

                    if (chat == null)
                        throw new Exception("Chat not found.");

                    if (!await chatManager.IsUserInChat(currentUserId, chat.Id))
                        throw new Exception("User not in this chat.");



                    return await messageManager.GetByChatIdAsync(chat.Id, skip, take ?? 30);
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
