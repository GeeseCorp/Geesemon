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
        IEnumerable<User> result = null;

        var tableName = GetTableName();
        var query =
                $@"SELECT * FROM {tableName} 
                WHERE(Identifier like '%' + @searchQuery + '%' or Email like '%' +  @searchQuery + '%') and Id != @currentUserId
                ORDER BY FirstName, LastName 
                OFFSET @skip ROWS
                FETCH NEXT @take ROWS ONLY;";

        result = await connection.QueryAsync<User>(query, new { take, skip, searchQuery, currentUserId });

        return result.ToList();
    }
    //public Task<List<User>> GetAsync(int take, int skip, string query, Guid? currentUserId = null)
    //{
    //    return context.Users
    //        .Where(u => (u.Identifier.Contains(query) || (u.Email != null && u.Email.Contains(query))) && u.Id != currentUserId)
    //        .OrderBy(u => u.FirstName)
    //        .ThenBy(u => u.LastName)
    //        .Skip(skip)
    //        .Take(take)
    //        .ToListAsync();
    //}
}
