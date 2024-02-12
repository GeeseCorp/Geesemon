namespace Geesemon.Model.Common;
public static class ColorGenerator
{
    public static string GetRandomColor()
    {
        var rnd = new Random();

        return colors[rnd.Next(0, colors.Count - 1)];
    }


    public static readonly List<string> colors = new List<string>()
        {
            "#1abc9c", "#2ecc71", "#3498db", "#9b59b6",
            "#16a085", "#27ae60", "#2980b9", "#8e44ad",
            "#f1c40f", "#e67e22", "#e74c3c", "#f39c12",
            "#d35400", "#c0392b", "#6ab04c", "#be2edd",
        };
}
