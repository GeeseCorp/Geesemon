using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class LoginInputType : InputObjectGraphType<LoginInput>
    {
        public LoginInputType()
            : base()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Login");

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Password");
        }
    }

    public class LoginInput
    {
        public string Login { get; set; }

        public string Password { get; set; }
    }
}
