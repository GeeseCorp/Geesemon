using GraphQL.Types;

namespace Geesemon.Web.GraphQL.Types;

public class CreateGroupChatInputType : InputObjectGraphType<CreateGroupChatInput>
{
    public CreateGroupChatInputType()
    {

        Field<NonNullGraphType<ListGraphType<GuidGraphType>>, List<Guid>>()
            .Name("UsersId");

        Field<NonNullGraphType<StringGraphType>, string>()
            .Name("Name");

        //Field<NonNullGraphType<UploadGraphType>, string>()
        //    .Name("Image");
    }
}

public class CreateGroupChatInput
{
    public List<Guid> UsersId { get; set; }

    public string Name { get; set; }

    public IFormFile Image { get; set; }
}
