using Fluxor;
using Geesemon.Client.Store.Actions;

namespace Geesemon.Client.Store.Auth
{
    public static class Reducers
    {
        [ReducerMethod]
        public static AuthState ReduceLoginAction(AuthState state,
            LoginResultAction action)
        {
            return new AuthState(action.Auth);
        } 
        
        [ReducerMethod]
        public static AuthState ReduceLogoutAction(AuthState state,
            LogoutResultAction action)
        {
            return new AuthState();
        }
    }
}
