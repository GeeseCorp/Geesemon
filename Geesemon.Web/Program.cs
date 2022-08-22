using Geesemon.DataAccess.Managers;
using Geesemon.DataAccess.Providers;
using Geesemon.Utils.SettingsAccess;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL;
using Geesemon.Web.Model;
using Geesemon.Web.Services;
using GraphQL.Server.Transports.AspNetCore;
using GraphQL.Server.Transports.Subscriptions.Abstractions;
using Microsoft.EntityFrameworkCore;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>((options) =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"), b => b.MigrationsAssembly("Geesemon.DataAccess"));
});

builder.Services.AddScoped<UserManager>();
builder.Services.AddScoped<ChatManager>();
builder.Services.AddScoped<MessageManager>();
builder.Services.AddScoped<UserChatManager>();

builder.Services.AddSingleton<ISettingsProvider, SettingsProvider>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddTransient<IOperationMessageListener, AuthenticationListener>();

builder.Services.AddGraphQLApi(builder.Environment.IsDevelopment());
builder.Services.AddSingleton<IMessagerSubscriptionService, MessagerSubscriptionService>();

builder.Services.AddJwtAuthorization(builder.Configuration);

builder.Services.AddServices();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();

app.UseWebSockets();

app.UseGraphQLWebSockets<ApplicationSchema>();

app.UseGraphQL<ApplicationSchema, GraphQLHttpMiddleware<ApplicationSchema>>();
app.UseGraphQLAltair();

app.MapFallbackToFile("index.html");

app.Run();

