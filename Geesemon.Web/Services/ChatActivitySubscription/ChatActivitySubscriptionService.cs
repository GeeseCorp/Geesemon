using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Geesemon.Web.Services.ChatActivitySubscription;

public class ChatActivitySubscriptionService : IChatActivitySubscriptionService
{
    private readonly ISubject<Chat> chatActivityStream = new Subject<Chat>();

    private readonly IServiceProvider serviceProvider;

    public ChatActivitySubscriptionService(IServiceProvider serviceProvider)
    {
        this.serviceProvider = serviceProvider;
    }

    public async Task Notify(Guid userId)
    {
        using var scope = serviceProvider.CreateScope();
        var chatManager = scope.ServiceProvider.GetRequiredService<ChatManager>();
        var relatedToUserChats = await chatManager.GetAllForUserAsync(userId);
        foreach(var chat in relatedToUserChats)
            chatActivityStream.OnNext(chat);
    }

    public async Task<IObservable<Chat>> Subscribe(Guid chatId)
    {
        return chatActivityStream
            .Where(c => c.Id == chatId)
            .AsObservable();
    }
}
