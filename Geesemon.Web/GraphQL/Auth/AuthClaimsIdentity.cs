using System.Security.Claims;

namespace Geesemon.Web.GraphQL.Auth
{
    public class AuthClaimsIdentity : ClaimsIdentity
    {
        public const string DefaultIdClaimType = "Id";
        public const string DefaultIdentifierClaimType = "Identifier";
    }
}
