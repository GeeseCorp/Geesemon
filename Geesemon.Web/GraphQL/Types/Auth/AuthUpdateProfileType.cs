﻿using FluentValidation;
using Geesemon.DataAccess.Managers;
using GraphQL.Types;
using GraphQL.Upload.AspNetCore;
using Microsoft.AspNetCore.Http;

namespace Geesemon.Web.GraphQL.Types;

public class AuthUpdateProfileType : InputObjectGraphType<AuthUpdateProfile>
{
    public AuthUpdateProfileType()
        : base()
    {
        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Firstname")
           .Resolve(context => context.Source.Firstname);
        
        Field<StringGraphType, string>()
           .Name("Lastname")
           .Resolve(context => context.Source.Lastname);

        Field<NonNullGraphType<StringGraphType>, string>()
           .Name("Username")
           .Resolve(context => context.Source.Username);
        
        Field<StringGraphType, string?>()
           .Name("ImageUrl")
           .Resolve(context => context.Source.ImageUrl);
        
        Field<UploadGraphType, IFormFile?>()
           .Name("Image")
           .Resolve(context => context.Source.Image);
    }
}

public class AuthUpdateProfile
{
    public string Firstname { get; set; }
    public string? Lastname { get; set; }
    public string Username { get; set; }
    public string? ImageUrl { get; set; }
    public IFormFile? Image { get; set; }
}

public class AuthUpdateProfileValidator : AbstractValidator<AuthUpdateProfile>
{
    public AuthUpdateProfileValidator(IHttpContextAccessor httpContextAccessor, ChatManager chatManager, UserManager userManager)
    {
        RuleFor(r => r.Firstname)
            .NotEmpty()
            .NotNull()
            .MaximumLength(100);
        
        RuleFor(r => r.Lastname)
            .MaximumLength(100);
        
        RuleFor(r => r.Username)
            .NotEmpty()
            .NotNull()
            .MaximumLength(100)
            .MustAsync(async (input, username, cancellation) =>
            {
                var currentUserId = httpContextAccessor.HttpContext.User.Claims.GetUserId();
                var chat = await chatManager.GetByUsernameAsync(username);
                var user = await userManager.GetByUsernameAsync(username);
                return chat == null && (user == null || user.Id == currentUserId);
            }).WithMessage("Username already taken");

        RuleFor(r => r.ImageUrl)
            .MaximumLength(1000);

        RuleFor(r => r.Image);
    }
}