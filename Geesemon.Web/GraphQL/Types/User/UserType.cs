using Geesemon.DomainModel.Models;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class UserType : EntityType<UserModel>
    {
        public UserType() 
            : base()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("FirstName")
               .Resolve(context => context.Source.FirstName);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("LastName")
               .Resolve(context => context.Source.LastName);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Login")
               .Resolve(context => context.Source.Login);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Email")
               .Resolve(context => context.Source.Email);
            
            Field<StringGraphType, string>()
               .Name("PhoneNumber")
               .Resolve(context => context.Source.PhoneNumber);

            Field<StringGraphType, string>()
               .Name("Description")
               .Resolve(context => context.Source.Description);

            Field<NonNullGraphType<StringGraphType>, bool>()
               .Name("IsEmailConfirmed")
               .Resolve(context => context.Source.IsEmailConfirmed);

            Field<DateTimeGraphType, DateTime?>()
               .Name("DateOfBirth")
               .Resolve(context => context.Source.DateOfBirth);

            Field<NonNullGraphType<UserRoleType>, UserRole>()
               .Name("Role")
               .Resolve(context => context.Source.Role);
        }
    }
}
