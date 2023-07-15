using Fluxor;
using Geesemon.Model.GrapghQL.Auth;
using Geesemon.Model.Models;
using System;

namespace Geesemon.Client.Store.Auth
{
    [FeatureState]
    public class AuthState
    {
        public User User { get; set; }
        public string Token { get; set; }
        public Session Session { get; set; }

        public bool IsAuthenticated { get; set; }

        public AuthState() 
        {
            IsAuthenticated = false;
        }

        public AuthState(AuthResponse auth)
        {
            User = auth.User;
            Token = auth.Token;
            Session = auth.Session;

            if(User != null)
                IsAuthenticated = true;
        }
    }
}
