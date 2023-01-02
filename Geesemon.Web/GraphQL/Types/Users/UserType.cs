using Geesemon.DataAccess.Managers;
using Geesemon.Model.Enums;
using Geesemon.Model.Models;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class UserType : EntityType<User>
    {
        public UserType(IServiceProvider serviceProvider)
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
            
            Field<DateTimeGraphType, DateTime?>()
               .Name("LastTimeOnline")
               .ResolveAsync(async context =>
               {
                   using var scope = serviceProvider.CreateScope();
                   var sessionManager = scope.ServiceProvider.GetRequiredService<SessionManager>();
                   var session = await sessionManager.GetLastActiveAsync(context.Source.Id);
                   return session?.LastTimeOnline;
               });
            
            Field<BooleanGraphType, bool?>()
               .Name("IsOnline")
               .ResolveAsync(async context =>
               {
                   using var scope = serviceProvider.CreateScope();
                   var sessionManager = scope.ServiceProvider.GetRequiredService<SessionManager>();
                   var session = await sessionManager.GetLastActiveAsync(context.Source.Id);
                   return session?.IsOnline;
               });
        }
    }
}
