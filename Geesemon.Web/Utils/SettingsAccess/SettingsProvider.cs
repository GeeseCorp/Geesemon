using Microsoft.Extensions.Configuration;

namespace Geesemon.Web.Utils.SettingsAccess
{
    public class SettingsProvider : ISettingsProvider
    {

        public string GetConnectionString(string connectionId = "Default")
        {
            return Environment.GetEnvironmentVariable("ConnectionString");
        }

        public string GetAuthValidAudience()
        {
            return Environment.GetEnvironmentVariable("AuthValidAudience");
        }

        public string GetAuthValidIssuer()
        {
            return Environment.GetEnvironmentVariable("AuthValidIssuer");
        }

        public string GetAuthIssuerSigningKey()
        {
            return Environment.GetEnvironmentVariable("AuthIssuerSigningKey");
        }

        public string GetCloudinaryConnectionString()
        {
            return Environment.GetEnvironmentVariable("Cloudinary");
        }
    }
}
