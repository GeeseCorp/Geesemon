using Geesemon.DataAccess.Managers;
using Geesemon.DataAccess.Providers;
using Geesemon.Web.Extensions;
using Geesemon.Web.GraphQL;
using Geesemon.Web.Services;
using Geesemon.Web.Services.ChatActionsSubscription;
using Geesemon.Web.Services.MessageSubscription;
using Geesemon.Web.Utils.SettingsAccess;
using GraphQL.Server.Transports.Subscriptions.Abstractions;
using Microsoft.EntityFrameworkCore;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ISettingsProvider, SettingsProvider>();
var settingsProvider = builder.Services.BuildServiceProvider().GetService<ISettingsProvider>();

builder.Services.AddDbContext<AppDbContext>((options) =>
{
    options.UseSqlServer(settingsProvider.GetConnectionString() ?? AppDbContext.DefaultConnectionString, b => b.MigrationsAssembly("Geesemon.DataAccess"));
});

builder.Services.AddScoped<UserManager>();
builder.Services.AddScoped<ChatManager>();
builder.Services.AddScoped<MessageManager>();
builder.Services.AddScoped<UserChatManager>();
builder.Services.AddScoped<AccessTokenManager>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddTransient<IOperationMessageListener, AuthenticationListener>();

builder.Services.AddGraphQLApi();
builder.Services.AddSingleton<IMessageActionSubscriptionService, MessageActionSubscriptionService>();
builder.Services.AddSingleton<IChatActionSubscriptionService, ChatActionSubscriptionService>();

builder.Services.AddJwtAuthorization(settingsProvider);

builder.Services.AddServices();

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

