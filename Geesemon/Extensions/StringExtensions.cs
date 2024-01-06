namespace Geesemon.Extensions;

public static class StringExtensions
{
    public static bool iContains(this string str, string value)
        => str.Contains(value, StringComparison.OrdinalIgnoreCase);
}
