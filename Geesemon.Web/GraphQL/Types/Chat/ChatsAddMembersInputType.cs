using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class ChatsAddMembersInputType : InputObjectGraphType<ChatsAddMembersInput>
{
    public ChatsAddMembersInputType()
    {
        Field<NonNullGraphType<GuidGraphType>, Guid>()
            .Name("ChatId")
            .Resolve(context => context.Source.ChatId);
        
        Field<NonNullGraphType<ListGraphType<GuidGraphType>>, IEnumerable<Guid>>()
            .Name("UserIds")
            .Resolve(context => context.Source.UserIds);
    }
}

public class ChatsAddMembersInput
{
    public Guid ChatId { get; set; }
    public IEnumerable<Guid> UserIds { get; set; }
}
