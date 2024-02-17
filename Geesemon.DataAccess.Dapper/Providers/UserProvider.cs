using Dapper;

using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Dapper.Providers;
public class UserProvider : BaseProvider<User>
{
    public UserProvider(DapperConnection dapperConnection)
        : base(dapperConnection)
    { }

    public async Task<List<User>> GetAsync(int take, int skip, string searchQuery, Guid? currentUserId = null)
    {
        using var connection = dapperConnection.Open();

        var tableName = GetTableName();
        var query =
                $@"SELECT * FROM {tableName} 
                WHERE(Identifier like '%' + @searchQuery + '%' or Email like '%' +  @searchQuery + '%' or LastName like '%' +  @searchQuery + '%' or FirstName like '%' +  @searchQuery + '%') and Id != @currentUserId
                ORDER BY FirstName, LastName 
                OFFSET @skip ROWS
                FETCH NEXT @take ROWS ONLY;";

        var result = await connection.QueryAsync<User>(query, new { take, skip, searchQuery, currentUserId });

        return result.ToList();
    }

    public async Task<User?> GetByIdentifierAsync(string identifier)
    {
        using var connection = dapperConnection.Open();

        var tableName = GetTableName();
        var query = $"SELECT * FROM {tableName} WHERE Identifier = @identifier";

        return await connection.QuerySingleOrDefaultAsync<User>(query, new { identifier });
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        using var connection = dapperConnection.Open();

        var tableName = GetTableName();
        var query = $"SELECT * FROM {tableName} WHERE Email = @email";

        return await connection.QuerySingleOrDefaultAsync<User?>(query, new { email });
    }

    public async Task<List<User>> GetReadByAsync(Guid messageId, int skip, int take)
    {
        using var connection = dapperConnection.Open();

        var tableName = GetTableName();
        var columns = GetColumns();
        var query =
                $@"SELECT {columns}, ReadMessages.[CreatedAt] FROM ReadMessages 
                INNER JOIN {tableName} 
                ON {tableName}.Id = ReadMessages.ReadById
                WHERE(MessageId = @messageId)
                ORDER BY ReadMessages.[CreatedAt] desc
                OFFSET @skip ROWS
                FETCH NEXT @take ROWS ONLY;";

        var result = await connection.QueryAsync<User>(query, new { take, skip, messageId });

        return result.ToList();
    }

    public async Task<int> GetReadByCountByAsync(Guid messageId)
    {
        using var connection = dapperConnection.Open();

        var tableName = GetTableName();
        var query =
                $@"SELECT COUNT(*) FROM ReadMessages 
                INNER JOIN {tableName} 
                ON {tableName}.Id = ReadMessages.ReadById
                WHERE(MessageId = @messageId)";

        var result = await connection.ExecuteScalarAsync<int>(query, new { messageId });

        return result;
    }

    public async Task<List<User>> GetAsync(Guid chatId)
    {
        using var connection = dapperConnection.Open();

        var tableName = GetTableName();
        var columns = GetColumns();
        var query =
                $@"SELECT {columns} FROM UserChats 
                INNER JOIN {tableName} 
                ON {tableName}.Id = UserChats.UserId
                WHERE(ChatId = @chatId)
        ";

        var result = await connection.QueryAsync<User>(query, new { chatId });

        return result.ToList();
    }
}
