using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Geesemon.Web.Services.ChatActivitySubscription;

public class ChatActivitySubscriptionService : IChatActivitySubscriptionService
{
    private readonly ISubject<UserChat> userChatActivityStream = new Subject<UserChat>();
    private readonly IServiceProvider serviceProvider;

    public ChatActivitySubscriptionService(IServiceProvider serviceProvider)
    {
        this.serviceProvider = serviceProvider;
    }

    public async Task Notify(Guid userId)
    {
        using var scope = serviceProvider.CreateScope();
        var chatManager = scope.ServiceProvider.GetRequiredService<ChatManager>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
        var relatedToUserChats = await chatManager.GetAllForUserAsync(userId);
        var user = await userManager.GetByIdAsync(userId);
        foreach (var chat in relatedToUserChats)
        {
            userChatActivityStream.OnNext(new UserChat
            {
                ChatId = chat.Id,
                Chat = chat,
                UserId = userId,
                User = user,
            });
        }
    }

    public async Task<IObservable<UserChat>> Subscribe(Guid chatId)
    {
        return userChatActivityStream
            .Where(uc => uc.ChatId == chatId)
            .AsObservable();
    }
}
