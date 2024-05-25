namespace Geesemon.Web.GeeseTexts;

public class GeeseText
{
    public GeeseText(KeyValuePair<string, string> keyValuePair)
    {
        this.Key = keyValuePair.Key;

        this.Value = keyValuePair.Value;
    }

    public GeeseText(string key, string value)
    {
        this.Key = key;

        this.Value = value;
    }

    public string Key { get; set; }

    public string Value { get; set; }
}

public class GeeseTextEqualityComparer : IEqualityComparer<GeeseText>
{
    public bool Equals(GeeseText text1, GeeseText text2)
    {
        return text1.Key == text2.Key;
    }

    public int GetHashCode(GeeseText text)
    {
        string hCode = text.Key;
        return hCode.GetHashCode();
    }
}
