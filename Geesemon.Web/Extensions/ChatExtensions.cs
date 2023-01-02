using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;

namespace Geesemon.Web.Extensions;

public static class ChatExtensions
{
    public static async Task<Chat> MapForUserAsync(this Chat chat, Guid currentUserId, IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
        var messageManager = scope.ServiceProvider.GetRequiredService<MessageManager>();
        switch (chat.Type)
        {
            case ChatKind.Personal:
                var oppositeUser = await userManager.GetByIdAsync(chat.UserChats.FirstOrDefault(uc => uc.UserId != currentUserId).UserId);
                chat.Name = oppositeUser.FirstName + " " + oppositeUser.LastName;
                chat.Identifier = oppositeUser.Identifier;
                chat.ImageColor = oppositeUser.AvatarColor;
                chat.ImageUrl = oppositeUser.ImageUrl;
                break;
            case ChatKind.Saved:
                var user = await userManager.GetByIdAsync(chat.CreatorId);
                chat.Name = "Saved Messages";
                chat.Identifier = user.Identifier;
                chat.ImageColor = user.AvatarColor;
                chat.ImageUrl = user.ImageUrl;
                break;
        }
        chat.NotReadMessagesCount = await messageManager.GetNotReadMessagesCount(chat.Id, currentUserId);
        return chat;
    }
    
    public static Chat MapWithUser(this Chat chat, User user, ChatKind chatKind)
    {
        chat.Name = chatKind == ChatKind.Saved ? "Saved Messages" : user.FirstName + " " + user.LastName;
        chat.Identifier = user.Identifier;
        chat.ImageColor = user.AvatarColor;
        chat.ImageUrl = user.ImageUrl;
        chat.Type = chatKind;
        return chat;
    }
    
    public static async Task<IEnumerable<Chat>> MapForUserAsync(this IEnumerable<Chat> chats, Guid currentUserId, IServiceProvider serviceProvider)
    {
        await Parallel.ForEachAsync(chats, async (chat, token) =>
        {
            chat = await chat.MapForUserAsync(currentUserId, serviceProvider);
        });
        return chats;
    }
}
