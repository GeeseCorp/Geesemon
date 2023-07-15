using Blazored.LocalStorage;
using Fluxor;
using Geesemon.Client.Data;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using Microsoft.Extensions.Logging;

namespace Geesemon.Client;
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
            });

        builder.Services.AddMauiBlazorWebView();

#if DEBUG
		builder.Services.AddBlazorWebViewDeveloperTools();
		builder.Logging.AddDebug();
#endif

        builder.Services.AddBlazoredLocalStorage();
        builder.Services.AddSingleton<WeatherForecastService>();

        builder.Services.AddSingleton(new GraphQLHttpClient("https://localhost:7195/graphql", new NewtonsoftJsonSerializer()));

        var currentAssembly = typeof(MauiProgram).Assembly;
        builder.Services.AddFluxor(options => options.ScanAssemblies(currentAssembly));

        return builder.Build();
    }
}
