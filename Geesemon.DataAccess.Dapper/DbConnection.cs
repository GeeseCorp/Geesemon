using Microsoft.Extensions.Configuration;

using System.Data;
using System.Data.SqlClient;

namespace Geesemon.DataAccess.Dapper;
public class DbConnection
{
    public readonly string ConnectionString;

    public DbConnection(IConfiguration config)
    {
        var connectionString = config.GetValue<string>("ConnectionString");

        if (string.IsNullOrWhiteSpace(connectionString))
            throw new ArgumentNullException("Connection string is not provided. Dapper context wasn't initialized.");

        ConnectionString = connectionString;
    }

    public IDbConnection Open() => new SqlConnection(ConnectionString);
}
