using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.DataLoaders;

using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class UserType : EntityType<User>
    {
        public UserType(SessionLoader sessionLoader)
            : base()
        {
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("FirstName")
               .Resolve(context => context.Source.FirstName);

            Field<StringGraphType, string?>()
               .Name("LastName")
               .Resolve(context => context.Source.LastName);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("FullName")
               .Resolve(context => context.Source.FullName);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Identifier")
               .Resolve(context => context.Source.Identifier);

            Field<StringGraphType, string?>()
               .Name("Email")
               .Resolve(context => context.Source.Email);

            Field<StringGraphType, string?>()
               .Name("PhoneNumber")
               .Resolve(context => context.Source.PhoneNumber);

            Field<StringGraphType, string?>()
               .Name("Description")
               .Resolve(context => context.Source.Description);

            Field<DateTimeGraphType, DateTime?>()
               .Name("DateOfBirth")
               .Resolve(context => context.Source.DateOfBirth);

            Field<NonNullGraphType<UserRoleType>, UserRole>()
               .Name("Role")
               .Resolve(context => context.Source.Role);

            Field<StringGraphType, string?>()
               .Name("ImageUrl")
               .Resolve(context => context.Source.ImageUrl);

            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("AvatarColor")
               .Resolve(context => context.Source.AvatarColor);

            Field<DateTimeGraphType>()
               .Name("LastTimeOnline")
               .Resolve(context =>
               {
                   return sessionLoader.ResolveLastActive<DateTime?>(s => s is null ? null : s.LastTimeOnline, context);
               });

            Field<BooleanGraphType>()
               .Name("IsOnline")
               .Resolve(context =>
               {
                   return sessionLoader.ResolveLastActive<bool?>(s => s is null ? null : s.IsOnline, context);
               });
        }
    }
}
