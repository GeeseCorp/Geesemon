using Geesemon.Model.Models;

namespace Geesemon.Web.GraphQL.Types
{
    public class AuthResponse
    {
        public Model.Models.User User { get; set; }
        public string Token { get; set; }
    }
}
