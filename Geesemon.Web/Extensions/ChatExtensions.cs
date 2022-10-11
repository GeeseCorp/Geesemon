using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;

namespace Geesemon.Web.Extensions;

public static class ChatExtensions
{
    public static async Task<Chat> MapForUserAsync(this Chat chat, Guid userId, UserManager userManager)
    {
        switch (chat.Type)
        {
            case ChatKind.Personal:
                var oppositeUser = await userManager.GetByIdAsync(chat.UserChats.FirstOrDefault(uc => uc.UserId != userId).UserId);
                chat.Name = oppositeUser.FirstName + " " + oppositeUser.LastName;
                chat.ImageColor = oppositeUser.AvatarColor;
                chat.ImageUrl = oppositeUser.ImageUrl;
                break;
            case ChatKind.Saved:
                chat.Name = "Saved Messages";
                break;
        }
        return chat;
    }
    
    public static async Task<IEnumerable<Chat>> MapForUserAsync(this IEnumerable<Chat> chats, Guid userId, UserManager userManager)
    {
        await Parallel.ForEachAsync(chats, async (chat, token) =>
        {
            chat = await chat.MapForUserAsync(userId, userManager);
        });
        return chats;
    }
}
