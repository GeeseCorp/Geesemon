using Geesemon.DataAccess.Dapper.Extensions;
using Geesemon.DataAccess.Extensions;
using Geesemon.Migrations.Extensions;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddServices(builder.Configuration);
builder.Services.AddMigrationServices(builder.Configuration);

var connectionString = builder.Configuration.GetValue<string>("ConnectionString");

builder.Services.AddMsSql(connectionString);
builder.Services.InitializeDapper();

builder.Services.AddGraphQLApi();
builder.Services.AddJwtAuthorization();
builder.Services.AddAuthorization();

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
    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Assets")),
});

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