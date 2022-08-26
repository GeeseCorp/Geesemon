using System.Data;

namespace Geesemon.Utils.SettingsAccess
{
    public interface ISettingsProvider
    {
        string GetConnectionString(string connectionId = "Default");

        string GetAuthValidAudience();

        string GetAuthValidIssuer();

        string GetAuthIssuerSigningKey();

        string GetCloudinaryConnectionString();
    }
}