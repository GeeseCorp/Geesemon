using FluentValidation;
using Geesemon.DataAccess.Managers;
using GraphQL.Types;
using GraphQL.Upload.AspNetCore;

namespace Geesemon.Web.GraphQL.Types;

public class SentMessageInputType : InputObjectGraphType<SentMessageInput>
{
    public SentMessageInputType()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("ChatUsername")
            .Resolve(context => context.Source.ChatUsername);
        
        Field<StringGraphType, string?>()
            .Name("Text")
            .Resolve(context => context.Source.Text);
        
        Field<GuidGraphType, Guid?>()
            .Name("ReplyMessageId")
            .Resolve(context => context.Source.ReplyMessageId);
        
        Field<ListGraphType<UploadGraphType>, IEnumerable<IFormFile>>()
            .Name("Files")
            .Resolve(context => context.Source.Files);
        
        Field<ListGraphType<GuidGraphType>, IEnumerable<Guid>>()
            .Name("ForwardedMessageIds")
            .Resolve(context => context.Source.ForwardedMessageIds);
    }
}

public class SentMessageInput
{
    public string ChatUsername { get; set; }
    public string? Text { get; set; }
    public Guid? ReplyMessageId { get; set; }
    public IEnumerable<IFormFile> Files { get; set; }
    public IEnumerable<Guid> ForwardedMessageIds { get; set; }
}

public class SentMessageInputValidator : AbstractValidator<SentMessageInput>
{
    public SentMessageInputValidator(ChatManager chatManager, IHttpContextAccessor httpContextAccessor, MessageManager messageManager)
    {
        RuleFor(r => r.ChatUsername)
            .NotNull()
            .MustAsync(async (chatUsername, cancellation) =>
            {
                var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                var chat = await chatManager.GetByUsernameAsync(chatUsername, currentUserId);
                return chat != null;
            }).WithMessage("Chat not found");

        RuleFor(r => r.Text)
            .Must((input, text) =>
            {
                return !(input.Files.Count() == 0 && string.IsNullOrEmpty(input.Text));
            }).WithMessage("Message text can not be empty");

        RuleFor(r => r.ReplyMessageId)
            .MustAsync(async (input, replyMessageId, cancellation) =>
            {
                if (replyMessageId == null)
                    return true;

                var message = await messageManager.GetByIdAsync(replyMessageId);
                return message != null;
            }).WithMessage("Reply message not found");

        RuleFor(r => r.Files);

        RuleFor(r => r.ForwardedMessageIds)
            .MustAsync(async (input, forwardedMessageIds, cancellation) =>
            {
                if (forwardedMessageIds == null || forwardedMessageIds.Count() == 0)
                    return true;

                foreach(var forwardedMessageId in forwardedMessageIds)
                {
                    var forwardedMessage = await messageManager.GetByIdAsync(forwardedMessageId);
                    if (forwardedMessage == null)
                        return false;
                }
                return true;
            }).WithMessage("One of forwarded message not found");
    }
}