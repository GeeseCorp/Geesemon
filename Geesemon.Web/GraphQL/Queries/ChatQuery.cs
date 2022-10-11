﻿using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL.Auth;
using Geesemon.Web.GraphQL.Types;
using GraphQL;
using GraphQL.Types;
using System.Threading.Tasks;

namespace Geesemon.Web.GraphQL.Queries
{
    public class ChatQuery : ObjectGraphType
    {
        public ChatQuery(IHttpContextAccessor httpContextAccessor)
        {
            Field<NonNullGraphType<ListGraphType<ChatType>>, IEnumerable<Chat>>()
                .Name("Get")
                .Argument<NonNullGraphType<IntGraphType>, int>("Skip", "")
                .Argument<IntGraphType, int?>("Take", "")
                .ResolveAsync(async context =>
                {
                    var skip = context.GetArgument<int>("Skip");
                    var take = context.GetArgument<int?>("Take");

                    var chatManager = context.RequestServices.GetRequiredService<ChatManager>();
                    var userManager = context.RequestServices.GetRequiredService<UserManager>();
                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    var chats = await chatManager.GetPaginatedForUserAsync(currentUserId, skip, take ?? 30);
                    chats = await chats.MapForUserAsync(currentUserId, userManager);

                    //foreach (var chat in chats)
                    //{
                    //    if (chat.Type == ChatKind.Personal)
                    //    {
                    //        var oppositeUser = await userManager.GetByIdAsync(chat.UserChats.FirstOrDefault(uc => uc.UserId != currentUserId).UserId);

                    //        chat.Name = oppositeUser.FirstName + " " + oppositeUser.LastName;
                    //        chat.ImageColor = oppositeUser.AvatarColor;
                    //        chat.ImageUrl = oppositeUser.ImageUrl;
                    //    }

                    //    if (chat.Type == ChatKind.Saved)
                    //    {
                    //        chat.Name = "Saved Messages";
                    //    }
                    //}

                    return chats;
                })
                .AuthorizeWith(AuthPolicies.Authenticated);
        }
    }
}
