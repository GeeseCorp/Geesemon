using System.Security.Claims;

namespace Geesemon.DomainModel.Models.Auth
{
    public class AuthClaimsIdentity : ClaimsIdentity
    {
        public const string DefaultIdClaimType = "Id";
        public const string DefaultLoginClaimType = "Login";
    }
}
