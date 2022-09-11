using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services;
using Geesemon.Web.Services.ChatActionsSubscription;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations
{
    public class ChatMutation : ObjectGraphType<object>
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly FileManagerService fileManagerService;
        private readonly IChatActionSubscriptionService subscriptionService;

        public ChatMutation(IHttpContextAccessor httpContextAccessor, FileManagerService fileManagerService, 
            IChatActionSubscriptionService subscriptionService)
        {
            Field<ChatType, Chat>()
                .Name("CreatePersonal")
                .Argument<CreatePersonalChatInputType>("Input", "Chat input for creating new chat.")
                .ResolveAsync(ResolveCreatePersonal)
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<ChatType, Chat>()
                .Name("CreateGroup")
                .Argument<CreateGroupChatInputType>("Input", "Chat input for creating new chat.")
                .ResolveAsync(ResolveCreateGroup)
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<ChatType, Chat>()
                .Name("Delete")
                .Argument<GuidGraphType>("Input", "Chat id for delete chat.")
                .ResolveAsync(ResolveDelete)
                .AuthorizeWith(AuthPolicies.Authenticated);

            this.httpContextAccessor = httpContextAccessor;
            this.fileManagerService = fileManagerService;
            this.subscriptionService = subscriptionService;
        }

        private async Task<Chat?> ResolveCreatePersonal(IResolveFieldContext context)
        {
            var chatManager = context.RequestServices.GetRequiredService<ChatManager>();
            var userChatManager = context.RequestServices.GetRequiredService<UserChatManager>();
            var userManager = context.RequestServices.GetRequiredService<UserManager>();
            var chatInp = context.GetArgument<CreatePersonalChatInput>("Input");
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

            var oppositeUser = await userManager.GetByIdAsync(chatInp.UserId);
            if (oppositeUser == null)
                throw new Exception("User not found");

            var userChats = await userChatManager.GetPersonalByUserIds(oppositeUser.Id, currentUserId);

            if (userChats.Count != 0)
                throw new Exception("Personal chat elready exist.");

            var chat = new Chat
            {
                Type = ChatKind.Personal,
                CreatorId = currentUserId
            };
            chat = await chatManager.CreateAsync(chat);

            chat.Name = oppositeUser.FirstName + " " + oppositeUser.LastName;
            chat.ImageUrl = oppositeUser.ImageUrl;


            var userChat = new List<UserChat>(){
                        new UserChat { UserId = currentUserId, ChatId = chat.Id },
                        new UserChat { UserId = chatInp.UserId, ChatId = chat.Id },
                    };
            await userChatManager.CreateManyAsync(userChat);

            subscriptionService.Notify(chat, ChatActionKind.Create);

            return chat;
        }

        private async Task<Chat?> ResolveCreateGroup(IResolveFieldContext context)
        {
            var chatManager = context.RequestServices.GetRequiredService<ChatManager>();
            var userChatManager = context.RequestServices.GetRequiredService<UserChatManager>();
            var userManager = context.RequestServices.GetRequiredService<UserManager>();
            var chatInput = context.GetArgument<CreateGroupChatInput>("Input");
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

            foreach (var userId in chatInput.UsersId)
            {
                var user = await userManager.GetByIdAsync(userId);
                if (user == null)
                    throw new Exception($"User with id {userId} not found");
            }
            string imageURL = null;

            if (chatInput.Image != null)
                imageURL = await fileManagerService.UploadFileAsync(FileManagerService.GroupImagesFolder, chatInput.Image);

            var chat = new Chat
            {
                Type = ChatKind.Group,
                CreatorId = currentUserId,
                Name = chatInput.Name,
                ImageUrl = imageURL,
            };
            chat = await chatManager.CreateAsync(chat);


            var userChat = new List<UserChat>(){
                        new UserChat { UserId = currentUserId, ChatId = chat.Id }
                    };
            foreach (var userId in chatInput.UsersId)
                userChat.Add(new UserChat { UserId = userId, ChatId = chat.Id });
            await userChatManager.CreateManyAsync(userChat);

            subscriptionService.Notify(chat, ChatActionKind.Create);

            return chat;
        }

        private async Task<Chat?> ResolveDelete(IResolveFieldContext context)
        {
            var chatManager = context.RequestServices.GetRequiredService<ChatManager>();
            var userChatManager = context.RequestServices.GetRequiredService<UserChatManager>();
            var userManager = context.RequestServices.GetRequiredService<UserManager>();
            var chatInput = context.GetArgument<CreateGroupChatInput>("Input");
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

            foreach (var userId in chatInput.UsersId)
            {
                var user = await userManager.GetByIdAsync(userId);
                if (user == null)
                    throw new Exception($"User with id {userId} not found");
            }
            string imageURL = null;

            if (chatInput.Image != null)
                imageURL = await fileManagerService.UploadFileAsync(FileManagerService.GroupImagesFolder, chatInput.Image);

            var chat = new Chat
            {
                Type = ChatKind.Group,
                CreatorId = currentUserId,
                Name = chatInput.Name,
                ImageUrl = imageURL,
            };
            chat = await chatManager.CreateAsync(chat);


            var userChat = new List<UserChat>(){
                        new UserChat { UserId = currentUserId, ChatId = chat.Id }
                    };
            foreach (var userId in chatInput.UsersId)
                userChat.Add(new UserChat { UserId = userId, ChatId = chat.Id });
            await userChatManager.CreateManyAsync(userChat);

            subscriptionService.Notify(chat, ChatActionKind.Create);

            return chat;
        }
    }
}
