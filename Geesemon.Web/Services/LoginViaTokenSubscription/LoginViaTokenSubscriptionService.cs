using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Geesemon.Web.Services.LoginViaTokenSubscription;

public class LoginViaTokenSubscriptionService : ILoginViaTokenSubscriptionService
{
    private readonly ISubject<LoginViaToken> loginViaTokenStream = new Subject<LoginViaToken>();

    public void Notify(LoginViaToken loginViaToken)
    {
        loginViaTokenStream.OnNext(loginViaToken);
    }

    public IObservable<LoginViaToken> Subscribe(string token)
    {
        return loginViaTokenStream
            .Where(s => s.Token == token)
            .AsObservable();
    }
}
