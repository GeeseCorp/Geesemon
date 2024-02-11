namespace Geesemon.Web.GraphQL.Types;

public class UserGetInput
{
    public int Take { get; set; }
    public int Skip { get; set; }
    public string Query { get; set; }
}
