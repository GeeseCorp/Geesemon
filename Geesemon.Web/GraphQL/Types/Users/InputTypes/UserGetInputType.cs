using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class UserGetInputType : InputObjectGraphType<UserGetInput>
{
    public UserGetInputType()
    {
        Field<NonNullGraphType<IntGraphType>, int>()
            .Name("Take")
            .Resolve(context => context.Source.Take);
        
        Field<NonNullGraphType<IntGraphType>, int>()
            .Name("Skip")
            .Resolve(context => context.Source.Skip);
        
        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Q")
            .Resolve(context => context.Source.Q);
    }
}
