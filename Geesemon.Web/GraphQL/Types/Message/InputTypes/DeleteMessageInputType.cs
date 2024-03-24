using FluentValidation;

using Geesemon.DataAccess.Dapper.Providers;
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;

using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class DeleteMessageInputType : InputObjectGraphType<DeleteMessageInput>
{
    public DeleteMessageInputType()
    {
        Field<NonNullGraphType<ListGraphType<GuidGraphType>>, IEnumerable<Guid>>()
            .Name("MessageIds")
            .Resolve(context => context.Source.MessageIds);
    }
}

public class DeleteMessageInput
{
    public IEnumerable<Guid> MessageIds { get; set; }
}

public class DeleteMessageInputValidator : AbstractValidator<DeleteMessageInput>
{
    public DeleteMessageInputValidator(MessageProvider messageProvider, ChatManager chatManager, IHttpContextAccessor httpContextAccessor)
    {
        RuleFor(r => r.MessageIds)
            .NotNull()
            .MustAsync(async (messageIds, cancellation) =>
            {
                foreach (var messageId in messageIds)
                {
                    var message = await messageProvider.GetByIdAsync(messageId);
                    if (message == null)
                        return false;

                    var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                    var chat = await chatManager.GetByIdAsync(message.ChatId);
                    if (message.FromId != currentUserId)
                        if (!await chatManager.IsUserInChat(currentUserId, message.ChatId) || chat.Type != ChatKind.Personal)
                            return false;
                }
                return true;
            }).WithMessage("Message doest not exists or you can't delete others messages.");
    }
}