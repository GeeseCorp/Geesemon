﻿using FluentValidation;
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using Geesemon.Web.Services;
using Geesemon.Web.Services.ChatActionsSubscription;
using Geesemon.Web.Services.MessageSubscription;
using GraphQL;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Mutations
{
    public class ChatMutation : ObjectGraphType<object>
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly FileManagerService fileManagerService;
        private readonly IChatActionSubscriptionService subscriptionService;
        private readonly IMessageActionSubscriptionService messageSubscriptionService;
        private readonly ChatManager chatManager;
        private readonly IValidator<CreateGroupChatInput> createGroupChatInputValidator;
        private readonly IValidator<UpdateChatInput> updateChatInputValidator;

        public ChatMutation(
            IHttpContextAccessor httpContextAccessor,
            FileManagerService fileManagerService,
            IChatActionSubscriptionService chatSubscriptionService,
            IMessageActionSubscriptionService messageSubscriptionService,
            ChatManager chatManager,
            IValidator<CreateGroupChatInput> createGroupChatInputValidator,
            IValidator<UpdateChatInput> updateChatInputValidator
            )
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

            Field<BooleanGraphType, bool>()
                .Name("Delete")
                .Argument<GuidGraphType>("Input", "Chat id for delete chat.")
                .ResolveAsync(ResolveDelete)
                .AuthorizeWith(AuthPolicies.Authenticated);

            Field<ChatType, Chat>()
                .Name("Update")
                .Argument<UpdateChatInputType>("Input", "Chat input for updating chat.")
                .ResolveAsync(ResolveUpdate)
                .AuthorizeWith(AuthPolicies.Authenticated);

            this.httpContextAccessor = httpContextAccessor;
            this.fileManagerService = fileManagerService;
            this.subscriptionService = chatSubscriptionService;
            this.messageSubscriptionService = messageSubscriptionService;
            this.chatManager = chatManager;
            this.createGroupChatInputValidator = createGroupChatInputValidator;
            this.updateChatInputValidator = updateChatInputValidator;
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

            var userChats = await userChatManager.GetPersonalByUserIdsAsync(oppositeUser.Id, currentUserId);

            if (userChats.Count != 0)
                throw new Exception("Personal chat already exist.");

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
                userChat.Add(new UserChat { UserId = chatInp.UserId, ChatId = chat.Id });
            await userChatManager.CreateManyAsync(userChat);

            //chat.Name = oppositeUser.FirstName + " " + oppositeUser.LastName;
            //chat.ImageUrl = oppositeUser.ImageUrl;
            chat = await chat.MapForUserAsync(currentUserId, userManager);
            return subscriptionService.Notify(chat, ChatActionKind.Create); ;
        }

        private async Task<Chat?> ResolveCreateGroup(IResolveFieldContext context)
        {
            var chatManager = context.RequestServices.GetRequiredService<ChatManager>();
            var userChatManager = context.RequestServices.GetRequiredService<UserChatManager>();
            var userManager = context.RequestServices.GetRequiredService<UserManager>();
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
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

            subscriptionService.Notify(chat, ChatActionKind.Create);

            var user = await userManager.GetByIdAsync(currentUserId);

            await messageSubscriptionService.SentSystemMessageAsync($"@{user.Username} created the group \"{chat.Name}\"", chat.Id);
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
            subscriptionService.Notify(chat, ChatActionKind.Delete);

            await chatManager.RemoveAsync(chatInput);
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

            subscriptionService.Notify(chat, ChatActionKind.Update);
            return chat;
        }
    }
}
