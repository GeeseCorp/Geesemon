using Microsoft.Extensions.Configuration;

using System.Data;
using System.Data.SqlClient;

namespace Geesemon.DataAccess.Dapper;
public class DapperConnection
{
    public readonly string ConnectionString;

    public DapperConnection(IConfiguration config)
    {
        if (string.IsNullOrWhiteSpace(config.GetValue<string>("ConnectionString")))
            throw new ArgumentNullException("Connection string is not provided. Dapper context wasn't created.");

        ConnectionString = config.GetValue<string>("ConnectionString");
    }

    public IDbConnection Open() => new SqlConnection(ConnectionString);
}
