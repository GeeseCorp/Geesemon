using Geesemon.DataAccess.Extensions;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL;
using Geesemon.Web.Utils.SettingsAccess;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddServices();

var settingsProvider = builder.Services.BuildServiceProvider().GetService<ISettingsProvider>();
builder.Services.AddMsSql(settingsProvider.GetConnectionString());

builder.Services.AddGraphQLApi();
builder.Services.AddJwtAuthorization(settingsProvider);

var MyAllowSpecificOrigins = "MyAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("https://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions()
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
        ctx.Context.Response.Headers.Append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    },
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot")),
    RequestPath = new PathString("")
});
app.UseRouting();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();

app.UseWebSockets();
app.UseGraphQLWebSockets<ApplicationSchema>();
app.UseGraphQLUpload<ApplicationSchema>()
    .UseGraphQL<ApplicationSchema>();
app.UseGraphQLAltair();

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "wwwroot";
});

app.Run();