using Dapper;

using Geesemon.Model.Common;
using Geesemon.Model.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Reflection;
using System.Text;

namespace Geesemon.DataAccess.Dapper.Providers;
public class BaseProvider<T> where T : Entity
{
    protected readonly DapperConnection dapperConnection;

    public BaseProvider(DapperConnection dapperConnection)
    {
        this.dapperConnection = dapperConnection;
    }

    public async Task<T> CreateAsync(T entity)
    {
        using var connection = dapperConnection.Open();
        int rowsEffected = 0;

        var tableName = GetTableName();
        var columns = GetColumns();
        var properties = GetPropertyNames();
        var query = $"INSERT INTO {tableName} ({columns}) VALUES ({properties})";

        rowsEffected = await connection.ExecuteAsync(query, entity);

        return rowsEffected > 0 ? entity : throw new Exception($"Failed to create {nameof(T)} entity in database.");
    }

    public async Task<bool> RemoveAsync(T entity)
    {
        using var connection = dapperConnection.Open();
        int rowsEffected = 0;

        var tableName = GetTableName();
        var keyColumn = GetKeyColumnName();
        var keyProperty = GetKeyPropertyName();

        var query = $"DELETE FROM {tableName} WHERE {keyColumn} = @{keyProperty}";

        rowsEffected = await connection.ExecuteAsync(query, entity);

        return rowsEffected > 0 ? true : false;
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        using var connection = dapperConnection.Open();
        IEnumerable<T> result = null;

        var tableName = GetTableName();
        var query = $"SELECT * FROM {tableName}";

        result = await connection.QueryAsync<T>(query);

        return result;
    }

    public async Task<T> GetByIdAsync(Guid Id)
    {
        using var connection = dapperConnection.Open();
        IEnumerable<T> result = null;

        var tableName = GetTableName();
        var keyColumn = GetKeyColumnName();

        var query = $"SELECT * FROM {tableName} WHERE {keyColumn} = '{Id}'";

        result = await connection.QueryAsync<T>(query);

        return result.FirstOrDefault();
    }

    public async Task<IEnumerable<T>> GetByIdsAsync(Guid[] Ids)
    {
        if (Ids.Length == 0)
            return Enumerable.Empty<T>();

        using var connection = dapperConnection.Open();
        IEnumerable<T> result = null;

        var tableName = GetTableName();
        var keyColumn = GetKeyColumnName();

        var whereParts = Ids.Select(id => $"{keyColumn} = '{id}'");

        var query = $"SELECT * FROM {tableName} WHERE " + string.Join(" OR ", whereParts);

        result = await connection.QueryAsync<T>(query);

        return result;
    }

    public Task<IEnumerable<T>> GetByIdsAsync(IEnumerable<Guid> Ids)
    {
        return GetByIdsAsync(Ids.ToArray());
    }

    public async Task<T> UpdateAsync(T entity)
    {
        using var connection = dapperConnection.Open();
        int rowsEffected = 0;

        var tableName = GetTableName();
        var keyColumn = GetKeyColumnName();
        var keyProperty = GetKeyPropertyName();

        StringBuilder query = new StringBuilder();
        query.Append($"UPDATE {tableName} SET ");

        foreach (var property in GetProperties(true))
        {
            var columnAttr = property.GetCustomAttribute<ColumnAttribute>();

            var propertyName = property.Name;
            var columnName = columnAttr.Name;

            query.Append($"{columnName} = @{propertyName},");
        }

        query.Remove(query.Length - 1, 1);

        query.Append($" WHERE {keyColumn} = @{keyProperty}");

        rowsEffected = await connection.ExecuteAsync(query.ToString(), entity);


        return rowsEffected > 0 ? entity : throw new Exception($"Failed to create {nameof(T)} entity in database.");
    }

    protected string GetTableName()
    {
        var type = typeof(T);
        var tableAttr = type.GetCustomAttribute<TableAttribute>();
        if (tableAttr != null)
        {
            return tableAttr.Name;
        }

        return type.Name + "s";
    }

    protected string GetColumns(bool excludeKey = false)
    {
        var type = typeof(T);
        var columns = string.Join(", ", type.GetProperties()
            .Where(p => !p.IsDefined(typeof(NotMappedAttribute)) && !p.IsDefined(typeof(DapperNotMappedAttribute)) && (!excludeKey || !p.IsDefined(typeof(KeyAttribute))))
            .Select(p =>
            {
                var columnAttr = p.GetCustomAttribute<ColumnAttribute>();
                return columnAttr != null ? GetTableName() + '.' + columnAttr.Name : p.Name;
            }));

        return columns;
    }

    protected string GetPropertyNames(bool excludeKey = false)
    {
        var properties = typeof(T).GetProperties()
            .Where(p => !p.IsDefined(typeof(NotMappedAttribute)) && !p.IsDefined(typeof(DapperNotMappedAttribute)) && (!excludeKey || p.GetCustomAttribute<KeyAttribute>() == null));

        var values = string.Join(", ", properties.Select(p =>
        {
            return $"@{p.Name}";
        }));

        return values;
    }

    protected IEnumerable<PropertyInfo> GetProperties(bool excludeKey = false)
    {
        var properties = typeof(T).GetProperties()
            .Where(p => !p.IsDefined(typeof(NotMappedAttribute)) && !p.IsDefined(typeof(DapperNotMappedAttribute)) && (!excludeKey || p.GetCustomAttribute<KeyAttribute>() == null));

        return properties;
    }

    protected string GetKeyPropertyName()
    {
        var properties = typeof(T).GetProperties()
            .Where(p => p.GetCustomAttribute<KeyAttribute>() != null);

        if (properties.Any())
        {
            return properties.FirstOrDefault().Name;
        }

        return null;
    }
    protected static string GetKeyColumnName()
    {
        PropertyInfo[] properties = typeof(T).GetProperties();

        foreach (PropertyInfo property in properties)
        {
            object[] keyAttributes = property.GetCustomAttributes(typeof(KeyAttribute), true);

            if (keyAttributes != null && keyAttributes.Length > 0)
            {
                object[] columnAttributes = property.GetCustomAttributes(typeof(ColumnAttribute), true);

                if (columnAttributes != null && columnAttributes.Length > 0)
                {
                    ColumnAttribute columnAttribute = (ColumnAttribute)columnAttributes[0];
                    return columnAttribute.Name;
                }
                else
                {
                    return property.Name;
                }
            }
        }

        return null;
    }
}

