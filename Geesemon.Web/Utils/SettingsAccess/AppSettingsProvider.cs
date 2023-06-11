namespace Geesemon.Web.Utils.SettingsAccess
{
    public class AppSettingsProvider : ISettingsProvider
    {
        private readonly IConfiguration configuration;

        public AppSettingsProvider(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public string GetConnectionString()
        {
            return configuration.GetValue<string>("ConnectionString");
        }

        public string GetAuthValidAudience()
        {
            return configuration.GetValue<string>("AuthValidAudience");
        }

        public string GetAuthValidIssuer()
        {
            return configuration.GetValue<string>("AuthValidIssuer");
        }

        public string GetAuthIssuerSigningKey()
        {
            return configuration.GetValue<string>("AuthIssuerSigningKey");
        }

        public string GetCloudinaryConnectionString()
        {
            return configuration.GetValue<string>("Cloudinary");
        }
    }
}
