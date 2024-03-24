using System.Data;
using System.Text.Json;

using static Dapper.SqlMapper;

namespace Geesemon.DataAccess.Dapper.TypeHandlers;
internal class JsonTypeHandler<T> : TypeHandler<T>
{
    public override T? Parse(object value)
    {
        var json = value.ToString();

        return JsonSerializer.Deserialize<T>(json);
    }

    public override void SetValue(IDbDataParameter parameter, T? value)
    {
        parameter.Value = JsonSerializer.Serialize(value);
    }
}
