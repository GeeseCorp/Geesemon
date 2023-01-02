using FluentValidation;
using Geesemon.DataAccess.Managers;
using GraphQL.Types;
using GraphQL.Upload.AspNetCore;

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
            .Name("Identifier")
            .Resolve(context => context.Source.Identifier );

        Field<UploadGraphType, IFormFile>()
            .Name("Image")
            .Resolve(context => context.Source.Image);
    }
}

public class UpdateChatInput
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Identifier  { get; set; }

    public IFormFile Image { get; set; }
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

        RuleFor(r => r.Identifier )
            .NotEmpty()
            .NotNull()
            .MaximumLength(100)
            .MustAsync(async (chat, identifier, cancellation) =>
            {
                var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                var checkChat = await chatManager.GetByIdentifierAsync(identifier, currentUserId);
                return checkChat == null || checkChat.Id == chat.Id;
            }).WithMessage("Identifier already taken");
    }
}