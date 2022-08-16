using System.Security.Claims;
using EducationalPortal.Server.Services;
using GraphQL.Server.Transports.Subscriptions.Abstractions;
using Newtonsoft.Json.Linq;

namespace Geesemon.Web.Services
{
    public class AuthenticationListener : IOperationMessageListener
    {
        public static readonly string PRINCIPAL_KEY = "User";

        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly AuthService authService;

        public AuthenticationListener(IHttpContextAccessor contextAccessor, AuthService authService)
        {
            this.httpContextAccessor = contextAccessor;
            this.authService = authService;
        }

        private void BuildClaimsPrincipal(string token)
        {
            authService.ValidateJWTToken(token);
        }

        public Task BeforeHandleAsync(MessageHandlingContext context)
        {
            if (context.Message.Type == MessageType.GQL_CONNECTION_INIT)
            {
                var payload = JObject.Parse(context.Message.Payload.ToString());

                if (payload != null && payload.ContainsKey("Authorization"))
                {
                    var auth = payload.Value<string>("Authorization");

                    BuildClaimsPrincipal(auth);
                }
            }

            context.Properties[PRINCIPAL_KEY] = httpContextAccessor.HttpContext.User;

            return Task.CompletedTask;
        }

        public Task HandleAsync(MessageHandlingContext context) => Task.CompletedTask;
        public Task AfterHandleAsync(MessageHandlingContext context) => Task.CompletedTask;
    }
}
