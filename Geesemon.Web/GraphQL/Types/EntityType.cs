using Geesemon.Model.Common;

using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types
{
    public abstract class EntityType<T> : ObjectGraphType<T> where T : Entity
    {
        protected EntityType()
        {
            Field<NonNullGraphType<IdGraphType>, Guid>()
               .Name("Id")
               .Resolve(context => context.Source.Id);

            Field<NonNullGraphType<DateTimeGraphType>, DateTime>()
                .Name("CreatedAt")
                .Resolve(context => context.Source.CreatedAt);

            Field<NonNullGraphType<DateTimeGraphType>, DateTime>()
               .Name("UpdatedAt")
               .Resolve(context => context.Source.UpdatedAt);
        }
    }
}
