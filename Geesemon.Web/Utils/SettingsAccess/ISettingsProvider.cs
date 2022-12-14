using System.Data;

namespace Geesemon.Web.Utils.SettingsAccess
{
    public interface ISettingsProvider
    {
        string GetConnectionString();

        string GetAuthValidAudience();

        string GetAuthValidIssuer();

        string GetAuthIssuerSigningKey();

        string GetCloudinaryConnectionString();
    }
}