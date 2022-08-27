using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class RegisterInputType : InputObjectGraphType<RegisterInput>
    {
        public RegisterInputType()
            : base()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Login");

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Password");

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("FirstName");

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("LastName");

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Email");
        }
    }

    public class RegisterInput
    {
        public string Login { get; set; }

        public string Password { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }
    }
}
