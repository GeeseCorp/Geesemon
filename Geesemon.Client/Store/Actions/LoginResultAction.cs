using Geesemon.Model.GrapghQL.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Geesemon.Client.Store.Actions;
public class LoginResultAction
{
    public AuthResponse Auth;

    public LoginResultAction(AuthResponse auth)
    {
        Auth = auth;
    }
}
