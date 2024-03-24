using Dapper;

using Geesemon.Model.Models;

namespace Geesemon.DataAccess.Dapper.Providers;

public class MessageProvider : BaseProvider<Message>
{
    public MessageProvider(DbConnection dbConnection)
        : base(dbConnection)
    {
    }

    public async Task<int> GetNotReadMessagesCount(Guid chatId, Guid currentUserId)
    {
        using var connection = dbConnection.Open();

        var tableName = GetTableName();
        var query =
                $@"
                    SELECT count(*) FROM {tableName}
                    WHERE ChatId = @chatId AND 
                    FromId != @currentUserId AND
                    Messages.Id != ALL (SELECT MessageId FROM ReadMessages WHERE ReadById = @currentUserId)
                ";
        var result = await connection.ExecuteScalarAsync<int>(query, new { chatId, currentUserId });

        return result;
    }

    public async Task<List<Message>> GetByChatIdAsync(Guid chatId, int skip, int take = 30)
    {
        using var connection = dbConnection.Open();

        var tableName = GetTableName();
        var columns = GetColumns();
        var query =
                $@"
                    SELECT {columns} FROM {tableName} 
                    WHERE(ChatId = @chatId)
                    ORDER BY CreatedAt desc
                    OFFSET @skip ROWS
                    FETCH NEXT @take ROWS ONLY;
                ";

        var response = await connection.QueryAsync<Message>(query, new { take, skip, chatId });

        return response.ToList();
    }
}
