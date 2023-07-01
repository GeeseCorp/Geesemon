using Geesemon.Web.GeeseTexts;
using Newtonsoft.Json;

namespace Geesemon.Web.Geesetext;

public class GeeseTextsAccessor
{
    private Dictionary<Language, List<GeeseText>> GeeseTexts =
        new Dictionary<Language, List<GeeseText>>();

    public GeeseTextsAccessor()
    {
        ParseTexts();
        FillMissingTexts();
    }

    public List<GeeseText> GetTexts(Language language)
    {
        return GeeseTexts[language];
    }

    public string GetText(Language language, string textCode)
    {
        return GeeseTexts[language].FirstOrDefault(t => t.Key == textCode)?.Value;
    }


    private void ParseTexts()
    {
        foreach (var lang in Enum.GetNames<Language>())
        {
            var textsJson = File.ReadAllText(@$".\GeeseTexts\GeeseTexts_{lang}.json");
            var texts = JsonConvert.DeserializeObject<Dictionary<string, string>>(textsJson);

            var geeseTexts = new List<GeeseText>();

            foreach (var text in texts)
                geeseTexts.Add(new GeeseText(text));

            GeeseTexts.Add(Enum.Parse<Language>(lang), geeseTexts);
        }
    }

    private void FillMissingTexts()
    {
        foreach (var lang in Enum.GetNames<Language>())
        {
            if (lang == Language.EN.ToString())
                continue;

            foreach (var text in GeeseTexts[Language.EN])
            {
                var langTexts = GeeseTexts[Enum.Parse<Language>(lang)];
                if (langTexts != null && !langTexts.Contains(text, new GeeseTextEqualityComparer()))
                {
                    langTexts.Add(text);
                }
            }
        }
    }

    public static List<GeeseText> LanguagesTexts = new List<GeeseText>
    {
       new GeeseText(Language.EN.ToString(), "English" ),
       new GeeseText(Language.RU.ToString(), "Русский" ),
       new GeeseText(Language.UA.ToString(), "Українська" ),
    };
}
