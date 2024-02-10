using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Dapper.Providers;
public class UserProvider : BaseProvider<User>
{
    public UserProvider(DapperConnection dapperConnection)
        : base(dapperConnection)
    { }
}
