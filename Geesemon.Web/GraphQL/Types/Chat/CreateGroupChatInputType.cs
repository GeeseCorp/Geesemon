using FluentValidation;

using Geesemon.DataAccess.Dapper.Providers;
using Geesemon.DataAccess.Managers;

using GraphQL.Types;
using GraphQL.Upload.AspNetCore;

namespace Geesemon.Web.GraphQL.Types;

public class CreateGroupChatInputType : InputObjectGraphType<CreateGroupChatInput>
{
    public CreateGroupChatInputType()
    {
        Field<NonNullGraphType<ListGraphType<GuidGraphType>>, List<Guid>>()
            .Name("UsersId")
            .Resolve(context => context.Source.UsersId);

        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Name")
            .Resolve(context => context.Source.Name);

        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Identifier")
            .Resolve(context => context.Source.Identifier);

        Field<UploadGraphType, IFormFile>()
            .Name("Image")
            .Resolve(context => context.Source.Image);
    }
}

public class CreateGroupChatInput
{
    public List<Guid> UsersId { get; set; }
    public string Name { get; set; }
    public string Identifier { get; set; }
    public IFormFile Image { get; set; }
}

public class CreateGroupChatInputValidation : AbstractValidator<CreateGroupChatInput>
{
    public CreateGroupChatInputValidation(ChatManager chatManager, UserProvider userProvider, IHttpContextAccessor httpContextAccessor)
    {
        RuleFor(r => r.UsersId)
            .NotNull()
            .MustAsync(async (usersId, cancellation) =>
            {
                foreach (var userId in usersId)
                {
                    var user = await userProvider.GetByIdAsync(userId);
                    if (user == null)
                        return false;
                }
                return true;
            }).WithMessage("One of user ids does not exists"); ;

        RuleFor(r => r.Name)
            .NotEmpty()
            .NotNull()
            .MaximumLength(100);

        RuleFor(r => r.Identifier)
            .NotEmpty()
            .NotNull()
            .MaximumLength(100)
            .MustAsync(async (identifier, cancellation) =>
            {
                var currentIdentifier = httpContextAccessor.HttpContext.User.Claims.GetIdentifier();
                if (currentIdentifier == identifier)
                    return false;

                var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                var chat = await chatManager.GetByIdentifierAsync(identifier, currentUserId);
                return chat == null;
            }).WithMessage("Identifier already taken");

        RuleFor(r => r.Image);
    }
}