using FluentValidation;
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services;
using Geesemon.Web.Services.ChatActionsSubscription;
using Geesemon.Web.Services.ChatActivitySubscription;
using Geesemon.Web.Services.MessageSubscription;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations
{
    public class ChatMutation : ObjectGraphType
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly FileManagerService fileManagerService;
        private readonly IChatActionSubscriptionService chatActionSubscriptionService;
        private readonly IMessageActionSubscriptionService messageSubscriptionService;
        private readonly IChatActivitySubscriptionService chatActivitySubscriptionService;
        private readonly ChatManager chatManager;
        private readonly UserChatManager userChatManager;
        private readonly UserManager userManager;
        private readonly IServiceProvider serviceProvider;
        private readonly IValidator<CreateGroupChatInput> createGroupChatInputValidator;
        private readonly IValidator<UpdateChatInput> updateChatInputValidator;
        private readonly MessageManager messageManager;

        public ChatMutation(
            IHttpContextAccessor httpContextAccessor,
            FileManagerService fileManagerService,
            IChatActionSubscriptionService chatActionSubscriptionService,
            IMessageActionSubscriptionService messageSubscriptionService,
            IChatActivitySubscriptionService chatActivitySubscriptionService,
            ChatManager chatManager,
            UserChatManager userChatManager,
            UserManager userManager,
            IServiceProvider serviceProvider,
            IValidator<CreateGroupChatInput> createGroupChatInputValidator,
            IValidator<UpdateChatInput> updateChatInputValidator,
            MessageManager messageManager
            )
        {
            Field<NonNullGraphType<ChatType>, Chat>()
                .Name("CreatePersonal")
                .Argument<CreatePersonalChatInputType>("Input", "Chat input for creating new chat.")
                .ResolveAsync(ResolveCreatePersonal)
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<ChatType>, Chat>()
                .Name("CreateGroup")
                .Argument<CreateGroupChatInputType>("Input", "Chat input for creating new chat.")
                .ResolveAsync(ResolveCreateGroup)
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<BooleanGraphType>, bool>()
                .Name("Delete")
                .Argument<NonNullGraphType<GuidGraphType>>("Input", "Chat id for delete chat.")
                .ResolveAsync(ResolveDelete)
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<NonNullGraphType<ChatType>, Chat>()
                .Name("Update")
                .Argument<UpdateChatInputType>("Input", "Chat input for updating chat.")
                .ResolveAsync(ResolveUpdate)
                .AuthorizeWith(AuthPolicies.Authenticated);
            
            Field<NonNullGraphType<ListGraphType<UserType>>, IEnumerable<User>>()
                .Name("AddMembers")
                .Argument<NonNullGraphType<ChatsAddMembersInputType>, ChatsAddMembersInput>("Input", "")
                .ResolveAsync(ResolveAddMembers)
                .AuthorizeWith(AuthPolicies.Authenticated);
            
            Field<NonNullGraphType<ListGraphType<UserType>>, IEnumerable<User>>()
                .Name("RemoveMembers")
                .Argument<NonNullGraphType<ChatsAddMembersInputType>, ChatsAddMembersInput>("Input", "")
                .ResolveAsync(ResolveRemoveMembers)
                .AuthorizeWith(AuthPolicies.Authenticated);

            this.httpContextAccessor = httpContextAccessor;
            this.fileManagerService = fileManagerService;
            this.chatActionSubscriptionService = chatActionSubscriptionService;
            this.messageSubscriptionService = messageSubscriptionService;
            this.chatActivitySubscriptionService = chatActivitySubscriptionService;
            this.chatManager = chatManager;
            this.userChatManager = userChatManager;
            this.userManager = userManager;
            this.serviceProvider = serviceProvider;
            this.createGroupChatInputValidator = createGroupChatInputValidator;
            this.updateChatInputValidator = updateChatInputValidator;
            this.messageManager = messageManager;
        }

        private async Task<Chat?> ResolveCreatePersonal(IResolveFieldContext context)
        {
            var chatInp = context.GetArgument<CreatePersonalChatInput>("Input");
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

            var checkChat = await chatManager.GetByUsernameAsync(chatInp.Username, currentUserId);
            if (checkChat != null)
                throw new Exception("Personal chat already exists");

            var oppositeUser = await userManager.GetByUsernameAsync(chatInp.Username);

            var chat = new Chat
            {
                Type = oppositeUser.Id == currentUserId ? ChatKind.Saved : ChatKind.Personal,
                CreatorId = currentUserId
            };
            chat = await chatManager.CreateAsync(chat);

            var userChat = new List<UserChat>
            { 
                new UserChat { UserId = currentUserId, ChatId = chat.Id },
            };
            if (oppositeUser.Id != currentUserId)
                userChat.Add(new UserChat { UserId = oppositeUser.Id, ChatId = chat.Id });
            await userChatManager.CreateManyAsync(userChat);

            chat = await chat.MapForUserAsync(currentUserId, serviceProvider);
            chatActionSubscriptionService.Notify(chat, ChatActionKind.Add, userChat.Select(uc => uc.UserId));
            return chat;
        }

        private async Task<Chat?> ResolveCreateGroup(IResolveFieldContext context)
        {
            var chatManager = context.RequestServices.GetRequiredService<ChatManager>();
            var userChatManager = context.RequestServices.GetRequiredService<UserChatManager>();
            var userManager = context.RequestServices.GetRequiredService<UserManager>();
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
            var currentUsername = httpContextAccessor.HttpContext.User.Claims.GetUsername();
            var chatInput = context.GetArgument<CreateGroupChatInput>("Input");
            await createGroupChatInputValidator.ValidateAndThrowAsync(chatInput);

            string imageUrl = null;
            if (chatInput.Image != null)
                imageUrl = await fileManagerService.UploadFileAsync(FileManagerService.GroupImagesFolder, chatInput.Image);

            var chat = new Chat
            {
                Type = ChatKind.Group,
                CreatorId = currentUserId,
                Name = chatInput.Name,
                Username = chatInput.Username,
                ImageUrl = imageUrl,
            };
            chat = await chatManager.CreateAsync(chat);

            var userChat = new List<UserChat>
            {
                new UserChat { UserId = currentUserId, ChatId = chat.Id }
            };
            foreach (var userId in chatInput.UsersId)
                userChat.Add(new UserChat { UserId = userId, ChatId = chat.Id });
            await userChatManager.CreateManyAsync(userChat);

            chatActionSubscriptionService.Notify(chat, ChatActionKind.Add, userChat.Select(uc => uc.UserId));

            await messageSubscriptionService.SentSystemMessageAsync($"@{currentUsername} created the group \"{chat.Name}\"", chat.Id);
            return chat;
        }

        private async Task<bool> ResolveDelete(IResolveFieldContext context)
        {
            var chatInput = context.GetArgument<Guid>("Input");
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
            var chat = await chatManager.GetByIdAsync(chatInput);

            Exception exception = new Exception("User can only delete personal chats or chats he own.");

            if (chat == null)
                throw new Exception($"Chat with id {chatInput} doesn't exist.");

            if (!await chatManager.IsUserInChat(currentUserId, chatInput))
                throw exception;

            if (chat.Type != ChatKind.Personal && chat.CreatorId != currentUserId)
                throw exception;

            //NOTE: Because functionality in ChatActionSubscriptionService depends on chat being in database we need to run notify before deletion
            var userChats = await userChatManager.Get(chat.Id);
            await chatManager.RemoveAsync(chat.Id);
            chatActionSubscriptionService.Notify(chat, ChatActionKind.Delete, userChats.Select(uc => uc.UserId));
            return true;
        }

        private async Task<Chat?> ResolveUpdate(IResolveFieldContext context)
        {
            var chatUpdateInput = context.GetArgument<UpdateChatInput>("Input");
            await updateChatInputValidator.ValidateAndThrowAsync(chatUpdateInput);
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

            var chat = await chatManager.GetByIdAsync(chatUpdateInput.Id);

            Exception exception = new Exception("User can update only group chats he own.");

            if (!await chatManager.IsUserInChat(currentUserId, chat.Id))
                throw exception;

            if (chat.Type != ChatKind.Group && chat.CreatorId != currentUserId)
                throw exception;

            chat.Name = chatUpdateInput.Name;
            await chatManager.UpdateAsync(chat);

            var userChats = await userChatManager.Get(chat.Id);
            chatActionSubscriptionService.Notify(chat, ChatActionKind.Update, userChats.Select(uc => uc.UserId));
            return chat;
        }
        
        private async Task<IEnumerable<User>> ResolveAddMembers(IResolveFieldContext context)
        {
            var chatsAddMembersInput = context.GetArgument<ChatsAddMembersInput>("Input");
            var chat = await chatManager.GetByIdAsync(chatsAddMembersInput.ChatId);
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
            var currentUsername = httpContextAccessor.HttpContext.User.Claims.GetUsername();

            Exception exception = new Exception("User can update only group chats he own.");
            if (chat == null || !await chatManager.IsUserInChat(currentUserId, chat.Id))
                throw exception;

            if (chat.Type != ChatKind.Group || chat.CreatorId != currentUserId)
                throw exception;

            var newUserChats = new List<UserChat>();
            foreach(var userId in chatsAddMembersInput.UserIds)
            {
                var user = await userManager.GetByIdAsync(userId);
                if (user == null)
                    throw new ExecutionError($"User with id {user.Id} not found");

                var userChat = await userChatManager.Get(chatsAddMembersInput.ChatId, userId);
                if(userChat == null)
                    newUserChats.Add(new UserChat
                    {
                        ChatId = chatsAddMembersInput.ChatId,
                        UserId = user.Id,
                        User = user,
                    });
            }

            await userChatManager.CreateManyAsync(newUserChats);
            chatActionSubscriptionService.Notify(chat, ChatActionKind.Add, newUserChats.Select(uc => uc.UserId));

            foreach (var userChat in newUserChats)
            {
                var newMessage = new Message
                {
                    ChatId = chatsAddMembersInput.ChatId,
                    Text = $"@{currentUsername} added @{userChat.User.Username}",
                    Type = MessageKind.System,
                };
                newMessage = await messageManager.CreateAsync(newMessage);
                messageSubscriptionService.Notify(newMessage, MessageActionKind.Create);
                await chatActivitySubscriptionService.Notify(userChat.UserId);
            }
            return newUserChats.Select(uc => uc.User);
        }
        
        private async Task<IEnumerable<User>> ResolveRemoveMembers(IResolveFieldContext context)
        {
            var chatsAddMembersInput = context.GetArgument<ChatsAddMembersInput>("Input");
            var chat = await chatManager.GetByIdAsync(chatsAddMembersInput.ChatId);
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
            var currentUsername = httpContextAccessor.HttpContext.User.Claims.GetUsername();

            Exception exception = new Exception("User can update only group chats he own.");
            if (chat == null || !await chatManager.IsUserInChat(currentUserId, chat.Id))
                throw exception;

            if (chat.Type != ChatKind.Group || chat.CreatorId != currentUserId)
                throw exception;

            var removeUserChats = new List<UserChat>();
            foreach(var userId in chatsAddMembersInput.UserIds)
            {
                var user = await userManager.GetByIdAsync(userId);
                if (user == null)
                    throw new ExecutionError($"User with id {user.Id} not found");

                var userChat = await userChatManager.Get(chatsAddMembersInput.ChatId, userId);
                if (userChat == null)
                    throw new ExecutionError($"User {user.Username} not in chat");

                removeUserChats.Add(userChat);
            }

            chatActionSubscriptionService.Notify(chat, ChatActionKind.Delete, removeUserChats.Select(uc => uc.UserId));

            foreach (var userChat in removeUserChats)
            {
                await userChatManager.RemoveAsync(userChat);

                var newMessage = new Message
                {
                    ChatId = chatsAddMembersInput.ChatId,
                    Text = $"@{currentUsername} removed @{userChat.User.Username}",
                    Type = MessageKind.System,
                };
                newMessage = await messageManager.CreateAsync(newMessage);
                messageSubscriptionService.Notify(newMessage, MessageActionKind.Create);
                await chatActivitySubscriptionService.Notify(userChat.UserId);
            }
            return removeUserChats.Select(uc => uc.User);
        }
    }
}
