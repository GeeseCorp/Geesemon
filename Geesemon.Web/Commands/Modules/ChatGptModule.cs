using Geesemon.DataAccess.Dapper.Providers;
using Geesemon.Model.Models;
using Geesemon.Web.Services.MessageSubscription;
using Geesemon.Web.Utils.SettingsAccess;

using OpenAI_API;

namespace Geesemon.Web.Commands.Modules;

public class ChatGptModule(
    ISettingsProvider settingsProvider,
    MessageProvider messageProvider,
    IMessageActionSubscriptionService messageActionSubscriptionService) : ICommandModule
{
    readonly MessageProvider messageProvider = messageProvider;
    readonly IMessageActionSubscriptionService messageActionSubscriptionService = messageActionSubscriptionService;
    readonly OpenAIAPI chatGpt = new OpenAIAPI(settingsProvider.GetChatGptApiKey());

    [Command("/ai")]
    public async Task Ai(CommandContext context)
    {
        var conversation = chatGpt.Chat.CreateConversation();

        conversation.AppendUserInput(context.Message);

        var chatGptResponse = await conversation.GetResponseFromChatbotAsync();

        var newMessage = new Message
        {
            ChatId = context.ChatId,
            Text = chatGptResponse,
            FromId = context.FromId,
        };

        var createdMessage = await messageProvider.CreateAsync(newMessage);
        messageActionSubscriptionService.Notify(createdMessage, MessageActionKind.Create);
    }
}
