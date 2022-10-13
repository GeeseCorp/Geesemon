using FluentValidation;
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
            .Name("Username")
            .Resolve(context => context.Source.Username);

        Field<UploadGraphType, IFormFile>()
            .Name("Image")
            .Resolve(context => context.Source.Image);
    }
}

public class CreateGroupChatInput
{
    public List<Guid> UsersId { get; set; }
    public string Name { get; set; }
    public string Username { get; set; }
    public IFormFile Image { get; set; }
}

public class CreateGroupChatInputValidation : AbstractValidator<CreateGroupChatInput>
{
    public CreateGroupChatInputValidation(ChatManager chatManager, UserManager userManager, IHttpContextAccessor httpContextAccessor)
    {
        RuleFor(r => r.UsersId)
            .NotNull()
            .MustAsync(async (usersId, cancellation) =>
            {
                foreach(var userId in usersId)
                {
                    var user = await userManager.GetByIdAsync(userId);
                    if (user == null)
                        return false;
                }
                return true;
            }).WithMessage("One of user ids does not exists"); ;

        RuleFor(r => r.Name)
            .NotEmpty()
            .NotNull()
            .MaximumLength(100);
        
        RuleFor(r => r.Username)
            .NotEmpty()
            .NotNull()
            .MaximumLength(100)
            .MustAsync(async (username, cancellation) =>
            {
                var currentUsername = httpContextAccessor.HttpContext.User.Claims.GetUsername();
                if (currentUsername == username)
                    return false;

                var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                var chat = await chatManager.GetByUsername(username, currentUserId);
                return chat == null;
            }).WithMessage("Username already taken");

        RuleFor(r => r.Image);
    }
}