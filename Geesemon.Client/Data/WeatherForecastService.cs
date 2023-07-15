using Geesemon.Model.GrapghQL.Auth;
using Geesemon.Model.Models;
using GraphQL;
using GraphQL.Client.Http;

namespace Geesemon.Client.Data;

public class WeatherForecastService
{
    private GraphQLHttpClient graphQLHttpClient;
    public WeatherForecastService(GraphQLHttpClient graphQLHttpClient)
    {
        this.graphQLHttpClient = graphQLHttpClient;
    }

    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    public Task<WeatherForecast[]> GetForecastAsync(DateTime startDate)
    {
        return Task.FromResult(Enumerable.Range(1, 5).Select(index => new WeatherForecast
        {
            Date = startDate.AddDays(index),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        }).ToArray());
    }

    public async void GetUsers()
    {
        

        
    }
}

