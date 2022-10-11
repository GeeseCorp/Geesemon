using FluentValidation;
using Geesemon.DataAccess.Managers;
using Geesemon.Model.Models;
using GraphQL.Types;

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
    public UpdateChatInputValidation(ChatManager chatManager)
    {
        RuleFor(r => r.Id)
            .NotNull()
            .MustAsync(async (id, cancellation) =>
            {
                var checkChat = await chatManager.GetByIdAsync(id);
                return checkChat != null;
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
                var checkChat = await chatManager.GetByUsername(username);
                return checkChat == null || checkChat.Id == chat.Id;
            }).WithMessage("Username already taken");
    }
}