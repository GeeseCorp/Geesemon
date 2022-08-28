using Geesemon.Model.Enums;

namespace Geesemon.Web.GraphQL.Auth
{
    public class AuthPolicies
    {
        public static readonly string Authenticated = "Authenticated";
        public static readonly string User = UserRole.User.ToString();
        public static readonly string Admin = UserRole.Admin.ToString();
    }
}
