﻿using Geesemon.DataAccess.Managers;
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
        private readonly IHttpContextAccessor httpContextAccessor;

        public ChatMutation(IHttpContextAccessor httpContextAccessor)
        {
            Field<ChatType, Chat>()
                .Name("CreatePersonal")
                .Argument<CreatePersonalChatInputType>("Input", "Chat input for creating new chat.")
                .ResolveAsync(ResolveCreatePersonal)
                .AuthorizeWithPolicy(AuthPolicies.Authenticated);

            Field<ChatType, Chat>()
                .Name("CreateGroup")
                .Argument<CreateGroupChatInputType>("Input", "Chat input for creating new chat.")
                .ResolveAsync(ResolveCreateGroup)
                .AuthorizeWithPolicy(AuthPolicies.Authenticated);

            this.httpContextAccessor = httpContextAccessor;
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

            return chat;
        }

        private async Task<Chat?> ResolveCreateGroup(IResolveFieldContext context)
        {
            var chatManager = context.RequestServices.GetRequiredService<ChatManager>();
            var userChatManager = context.RequestServices.GetRequiredService<UserChatManager>();
            var userManager = context.RequestServices.GetRequiredService<UserManager>();
            var chatInp = context.GetArgument<CreateGroupChatInput>("Input");
            var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();

            foreach (var userId in chatInp.UsersId)
            {
                var user = await userManager.GetByIdAsync(userId);
                if (user == null)
                    throw new Exception($"User with id {userId} not found");
            }

            var chat = new Chat
            {
                Type = ChatKind.Group,
                CreatorId = currentUserId,
                Name = chatInp.Name,
            };
            chat = await chatManager.CreateAsync(chat);


            var userChat = new List<UserChat>(){
                        new UserChat { UserId = currentUserId, ChatId = chat.Id }
                    };
            foreach (var userId in chatInp.UsersId)
                userChat.Add(new UserChat { UserId = userId, ChatId = chat.Id });
            await userChatManager.CreateManyAsync(userChat);

            return chat;
        }
    }
}