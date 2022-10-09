using FluentValidation;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class AuthLoginInputType : InputObjectGraphType<AuthLoginInput>
    {
        public AuthLoginInputType()
            : base()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Login")
               .Resolve(context => context.Source.Login);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Password")
               .Resolve(context => context.Source.Password);
        }
    }

    public class AuthLoginInput
    {
        public string Login { get; set; }

        public string Password { get; set; }
    }

    public class AuthLoginInputValidation : AbstractValidator<AuthLoginInput>
    {
        public AuthLoginInputValidation()
        {
            RuleFor(r => r.Login)
                .NotEmpty()
                .NotNull()
                .MaximumLength(100);

            RuleFor(r => r.Password)
                .NotEmpty()
                .NotNull()
                .MaximumLength(100);
        }
    }
}
