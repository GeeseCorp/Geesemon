using Geesemon.Model.Enums;
using Geesemon.Web.GraphQL.Auth;
using Newtonsoft.Json;
using System.Security.Claims;

public static class ClaimExtensions
{
    public static Guid GetUserId(this IEnumerable<Claim> claims)
    {
        return new Guid(claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value);
    }
    
    public static string GetIdentifier(this IEnumerable<Claim> claims)
    {
        return claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdentifierClaimType).Value;
    }

    public static UserRole GetRole(this IEnumerable<Claim> claims)
    {
        UserRole role;
        if (!Enum.TryParse(claims.First(c => c.Type == AuthClaimsIdentity.DefaultRoleClaimType).Value, out role))
        {
            throw new Exception("Bad role");
        }
        return role;
    }
}
