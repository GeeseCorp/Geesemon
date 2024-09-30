using Geesemon.DataAccess.Dapper.Providers;
using Geesemon.Model.Models;
using Geesemon.Web.Services.MessageSubscription;
using Geesemon.Web.Utils.SettingsAccess;

using OpenAI_API;

namespace Geesemon.Web.Commands.Modules;

public class ChatGptModule(
    ISettingsProvider settingsProvider,
    MessageProvider messageProvider,
    IMessageActionSubscriptionService messageActionSubscriptionService)
    : ICommandModule
{
    readonly MessageProvider messageProvider = messageProvider;
    readonly IMessageActionSubscriptionService messageActionSubscriptionService = messageActionSubscriptionService;
    readonly OpenAIAPI chatGpt = new OpenAIAPI(settingsProvider.GetChatGptApiKey());

    [Command("/ai")]
    public async Task Ai(CommandContext context)
    {
        var conversation = chatGpt.Chat.CreateConversation();

        conversation.AppendUserInput(context.Message);

        Message? message = null;
        await foreach (var messagePart in conversation.StreamResponseEnumerableFromChatbotAsync())
        {
            if (message == null)
            {
                message = new Message
                {
                    ChatId = context.ChatId,
                    Text = messagePart,
                    FromId = context.FromId,
                };

                message = await messageProvider.CreateAsync(message);
                messageActionSubscriptionService.Notify(message, MessageActionKind.Create);
                continue;
            }

            message.Text += messagePart;
            message = await messageProvider.UpdateAsync(message);
            messageActionSubscriptionService.Notify(message, MessageActionKind.Update);
        }
    }
}
