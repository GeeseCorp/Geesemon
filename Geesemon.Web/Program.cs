using Geesemon.DataAccess.Extensions;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL;
using Geesemon.Web.Utils.SettingsAccess;

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
            .AllowAnyMethod();
        });
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
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