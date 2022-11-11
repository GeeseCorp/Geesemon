﻿using FluentValidation;
using Geesemon.DataAccess.Managers;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class SentMessageInputType : InputObjectGraphType<SentMessageInput>
{
    public SentMessageInputType()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Identifier")
            .Resolve(context => context.Source.Identifier);
        
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Text")
            .Resolve(context => context.Source.Text);
        
        Field<GuidGraphType, Guid?>()
            .Name("ReplyMessageId")
            .Resolve(context => context.Source.ReplyMessageId);
    }
}

public class SentMessageInput
{
    public string Identifier { get; set; }
    public string Text { get; set; }
    public Guid? ReplyMessageId { get; set; }
}

public class SentMessageInputValidator : AbstractValidator<SentMessageInput>
{
    public SentMessageInputValidator(ChatManager chatManager, IHttpContextAccessor httpContextAccessor, MessageManager messageManager)
    {
        RuleFor(r => r.Identifier)
            .NotNull()
            .MustAsync(async (chatIdentifier, cancellation) =>
            {
                var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                var chat = await chatManager.GetByIdentifierAsync(chatIdentifier, currentUserId);
                return chat != null;
            }).WithMessage("Chat not found");

        RuleFor(r => r.Text)
            .NotEmpty()
            .NotNull();

        RuleFor(r => r.ReplyMessageId)
            .MustAsync(async (input, replyMessageId, cancellation) =>
            {
                if (replyMessageId == null)
                    return true;

                var message = await messageManager.GetByIdAsync(replyMessageId);
                return message != null;
            }).WithMessage("Reply message not found");
    }
}