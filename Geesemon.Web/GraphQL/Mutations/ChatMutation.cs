using Geesemon.DataAccess.Managers;
using Geesemon.DomainModel.Models.Auth;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations.Messages
{
    public class ChatMutation : ObjectGraphType<object>
    {
        public ChatMutation(IHttpContextAccessor httpContextAccessor)
        {
            Field<ChatType, Chat>()
                .Name("CreatePersonal")
                .Argument<CreatePersonalChatInputType>("Input", "Chat input for creating new chat.")
                .ResolveAsync(async context =>
                {
                    var chatManager = context.RequestServices.GetRequiredService<ChatManager>();
                    var userChatManager = context.RequestServices.GetRequiredService<UserChatManager>();
                    var userManager = context.RequestServices.GetRequiredService<UserManager>();
                    var chatInp = context.GetArgument<CreatePersonalChatInput>("Input");
                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

                    var oppositeUser = await userManager.GetByIdAsync(chatInp.UserId);
                    if (oppositeUser == null)
                        throw new Exception("User not found");

                    var chat = new Chat
                    {
                        Type = ChatKind.Personal,
                        CreatorId = currentUserId
                    };
                    chat = await chatManager.CreateAsync(chat);

                    chat.Name = oppositeUser.FirstName + " " + oppositeUser.LastName;
                    //TODO: Дописать присвоение картинки, епта
                    

                    var userChat = new List<UserChat>(){
                        new UserChat { UserId = currentUserId, ChatId = chat.Id },
                        new UserChat { UserId = chatInp.UserId, ChatId = chat.Id },
                    };
                    await userChatManager.CreateManyAsync(userChat);

                    return chat;
                })
                .AuthorizeWithPolicy(AuthPolicies.Authenticated);

        }
    }
}
