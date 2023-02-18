namespace Geesemon.Web.Utils.SettingsAccess
{
    public class EnvironmentSettingsProvider : ISettingsProvider
    {
        public string GetConnectionString()
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
