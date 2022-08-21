using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class UserInputType : InputObjectGraphType<User>
    {
        public UserInputType() 
            : base()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("FirstName");

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("LastName");

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Login");

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Email");

            Field<StringGraphType, string>()
               .Name("PhoneNumber");

            Field<StringGraphType, string>()
               .Name("Description");

            Field<BooleanGraphType, bool>()
               .Name("IsEmailConfirmed");

            Field<DateTimeGraphType, DateTime?>()
               .Name("DateOfBirth");

            Field<NonNullGraphType<UserRoleType>, UserRole>()
               .Name("Role");

            Field<NonNullGraphType<StringGraphType>, string>()
              .Name("Password");
        }
    }
}
