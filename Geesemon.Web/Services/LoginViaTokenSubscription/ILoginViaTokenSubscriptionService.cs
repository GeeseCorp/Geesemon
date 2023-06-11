namespace Geesemon.Web.Services.LoginViaTokenSubscription;

public interface ILoginViaTokenSubscriptionService
{
    void Notify(LoginViaToken loginViaToken);

    IObservable<LoginViaToken> Subscribe(string token);
}
