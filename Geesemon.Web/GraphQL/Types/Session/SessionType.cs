using Geesemon.Model.Models;
using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public class SessionType : EntityType<Session>
    {
        public SessionType()
            : base()
        {
            Field<NonNullGraphType<BooleanGraphType>, bool>()
               .Name("IsOnline")
               .Resolve(context => context.Source.IsOnline);

            Field<NonNullGraphType<DateTimeGraphType>, DateTime>()
               .Name("LastTimeOnline")
               .Resolve(context => context.Source.LastTimeOnline);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("UserAgent")
               .Resolve(context => context.Source.UserAgent);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("IpAddress")
               .Resolve(context => context.Source.IpAddress);
            
            Field<NonNullGraphType<StringGraphType>, string>()
               .Name("Location")
               .Resolve(context => context.Source.Location);
        }
    }
}
