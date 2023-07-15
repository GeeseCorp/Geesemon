namespace Geesemon.Client.Store.Actions
{
    public class LoginAction
    {
        public string Identifier;
        public string Password;

        public LoginAction(string identifier, string password)
        {
            Identifier = identifier;
            Password = password;
        }
    }
}
