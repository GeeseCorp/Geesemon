using Geesemon.Web.Services.ChatActivitySubscription;
using GraphQL.Server.Transports.Subscriptions.Abstractions;
using Newtonsoft.Json.Linq;

namespace Geesemon.Web.Services
{
    public class AuthenticationListener : IOperationMessageListener
    {
        public const string PRINCIPAL_KEY = "User";

        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly AuthService authService;

        public AuthenticationListener(IHttpContextAccessor contextAccessor, AuthService authService)
        {
            this.httpContextAccessor = contextAccessor;
            this.authService = authService;
        }

        public Task BeforeHandleAsync(MessageHandlingContext context)
        {
            if (context.Message.Type == MessageType.GQL_CONNECTION_INIT)
            {
                var payload = JObject.Parse(context.Message.Payload.ToString());

                if (payload != null && payload.ContainsKey("Authorization"))
                {
                    var token = payload.Value<string>("Authorization");
                    var principal = authService.ValidateAccessToken(token);
                    if (principal != null)
                    {
                        var userId = principal.Claims.GetUserId();
                        httpContextAccessor.HttpContext.User = principal;
                        context.Properties[PRINCIPAL_KEY] = principal;
                    }
                }
            }
            return Task.CompletedTask;
        }

        public Task HandleAsync(MessageHandlingContext context) => Task.CompletedTask;
        public Task AfterHandleAsync(MessageHandlingContext context) => Task.CompletedTask;
    }
}
