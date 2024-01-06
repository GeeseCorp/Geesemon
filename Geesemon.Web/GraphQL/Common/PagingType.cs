using Geesemon.Common;

using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Common;

public class PagingType : InputObjectGraphType<Paging>
{
    public PagingType()
    {
        Field<NonNullGraphType<IntGraphType>>()
            .Name("Take")
            .Resolve(c => c.Source.Take);

        Field<NonNullGraphType<IntGraphType>>()
            .Name("Skip")
            .Resolve(c => c.Source.Skip);
    }
}
