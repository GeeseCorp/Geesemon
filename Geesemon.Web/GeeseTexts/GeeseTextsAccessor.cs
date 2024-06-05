using Geesemon.Web.GeeseTexts;

using Newtonsoft.Json;

namespace Geesemon.Web.Geesetext;

public class GeeseTextsAccessor
{
    private Dictionary<LanguageCode, List<GeeseText>> GeeseTexts =
        new Dictionary<LanguageCode, List<GeeseText>>();

    public GeeseTextsAccessor()
    {
        ParseTexts();
        FillMissingTexts();
    }

    public static List<Language> Languages = new List<Language>
    {
       new Language(LanguageCode.EN, "English", "/images/flags/us.jpg"),
       //new Language(LanguageCode.RU, "Russian (Русский)", "/images/flags/ru.png"),
       new Language(LanguageCode.UK, "Ukrainian (Українська)", "/images/flags/uk.jpg" ),
    };

    public List<GeeseText> GetTexts(LanguageCode language)
    {
        return GeeseTexts[language];
    }

    public string GetText(LanguageCode language, string textCode)
    {
        return GeeseTexts[language].FirstOrDefault(t => t.Key == textCode)?.Value;
    }


    private void ParseTexts()
    {
        foreach (var lang in Languages)
        {
            var textsJson = File.ReadAllText(@$".\GeeseTexts\LanguagePacks\GeeseTexts_{lang.Code}.json");
            var texts = JsonConvert.DeserializeObject<Dictionary<string, string>>(textsJson);

            var geeseTexts = new List<GeeseText>();

            foreach (var text in texts)
                geeseTexts.Add(new GeeseText(text));

            GeeseTexts.Add(lang.Code, geeseTexts);
        }
    }

    private void FillMissingTexts()
    {
        foreach (var lang in Languages)
        {
            if (lang.Code == LanguageCode.EN)
                continue;

            foreach (var text in GeeseTexts[LanguageCode.EN])
            {
                var langTexts = GeeseTexts[lang.Code];
                if (langTexts != null && !langTexts.Contains(text, new GeeseTextEqualityComparer()))
                {
                    langTexts.Add(text);
                }
            }
        }
    }
}
