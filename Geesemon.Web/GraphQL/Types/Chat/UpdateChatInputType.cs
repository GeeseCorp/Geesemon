using FluentValidation;
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using GraphQL.Types;
using Microsoft.AspNetCore.Http;

namespace Geesemon.Web.GraphQL.Types;

public class UpdateChatInputType : InputObjectGraphType<UpdateChatInput>
{
    public UpdateChatInputType()
    {
        Field<NonNullGraphType<GuidGraphType>, Guid>()
            .Name("Id")
            .Resolve(context => context.Source.Id);

        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Name")
            .Resolve(context => context.Source.Name);
        
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Username")
            .Resolve(context => context.Source.Username);
    }
}

public class UpdateChatInput
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Username { get; set; }
}

public class UpdateChatInputValidation : AbstractValidator<UpdateChatInput>
{
    public UpdateChatInputValidation(ChatManager chatManager, IHttpContextAccessor httpContextAccessor)
    {
        RuleFor(r => r.Id)
            .NotNull()
            .MustAsync(async (id, cancellation) =>
            {
                var chat = await chatManager.GetByIdAsync(id);
                return chat != null;
            }).WithMessage("Chat with current id does not exists"); ;

        RuleFor(r => r.Name)
            .NotEmpty()
            .NotNull()
            .MaximumLength(100);

        RuleFor(r => r.Username)
            .NotEmpty()
            .NotNull()
            .MaximumLength(100)
            .MustAsync(async (chat, username, cancellation) =>
            {
                var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                var checkChat = await chatManager.GetByUsername(username, currentUserId);
                return checkChat == null || checkChat.Id == chat.Id;
            }).WithMessage("Username already taken");
    }
}