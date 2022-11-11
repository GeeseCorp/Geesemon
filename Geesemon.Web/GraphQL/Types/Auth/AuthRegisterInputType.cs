using FluentValidation;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class AuthRegisterInputType : InputObjectGraphType<AuthRegisterInput>
    {
        public AuthRegisterInputType()
            : base()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Identifier")
               .Resolve(context => context.Source.Identifier);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Password")
               .Resolve(context => context.Source.Password);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("FirstName")
               .Resolve(context => context.Source.FirstName);

            Field<StringGraphType, string?>()
               .Name("LastName")
               .Resolve(context => context.Source.LastName);

            Field<StringGraphType, string?>()
               .Name("Email")
               .Resolve(context => context.Source.Email);
        }
    }

    public class AuthRegisterInput
    {
        public string Identifier { get; set; }

        public string Password { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }
    }

    public class AuthRegisterInputValidation : AbstractValidator<AuthRegisterInput>
    {
        public AuthRegisterInputValidation()
        {
            RuleFor(r => r.Identifier)
                .NotEmpty()
                .NotNull()
                .MaximumLength(100);

            RuleFor(r => r.Password)
                .NotEmpty()
                .NotNull()
                .MinimumLength(3)
                .MaximumLength(100);

            RuleFor(r => r.FirstName)
                .NotEmpty()
                .NotNull()
                .MaximumLength(100);

            RuleFor(r => r.LastName)
                .MaximumLength(100);

            RuleFor(r => r.Email)
                .EmailAddress()
                .MaximumLength(100);
        }
    }
}
