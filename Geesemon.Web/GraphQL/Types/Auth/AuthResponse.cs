using Geesemon.Model.Models;

namespace Geesemon.Web.GraphQL.Types.Auth
{
    public class AuthResponse
    {
        public User User { get; set; }
        public string Token { get; set; }
    }
}
