using Geesemon.Model.Models;

namespace Geesemon.Web.GraphQL.Types
{
    public class AuthResponse
    {
        public User User { get; set; }
        public string Token { get; set; }
        public Session Session { get; set; }
    }
}
