using Microsoft.Extensions.Configuration;

namespace Geesemon.Utils.SettingsAccess
{
    public class SettingsProvider : ISettingsProvider
    {
        private readonly IConfiguration config;

        public SettingsProvider(IConfiguration config)
        {
            this.config = config;
        }

        public string GetConnectionString(string connectionId = "Default")
        {
            return config.GetConnectionString(connectionId);
        }

        public string GetAuthValidAudience()
        {
            return config.GetSection("AuthValidAudience").Value;
        } 
        
        public string GetAuthValidIssuer()
        {
            return config.GetSection("AuthValidIssuer").Value;
        }

        public string GetAuthIssuerSigningKey()
        { 
            return config.GetSection("AuthIssuerSigningKey").Value;
        }
    }
}
