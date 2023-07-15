using Fluxor;
using Fluxor.Blazor.Web.Components;
using Geesemon.Client.Store.Actions;
using Geesemon.Client.Store.Auth;
using Microsoft.AspNetCore.Components;

namespace Geesemon.Client;
public class AuthedFluxorComponent : FluxorComponent
{
    [Inject]
    private IState<AuthState> AuthState { get; set; }
    
    [Inject]
    private NavigationManager NavigationManager { get; set; }

    [Inject]
    private Fluxor.IDispatcher Dispatcher { get; set; }

    //protected override Task OnInitializedAsync()
    //{
    //    Dispatcher.Dispatch(new MeAction());

    //    return Task.CompletedTask;
    //}

    protected override Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            Dispatcher.Dispatch(new MeAction());
        }

        if (AuthState?.Value?.IsAuthenticated == null || !AuthState.Value.IsAuthenticated)
        {
            NavigationManager.NavigateTo("/Login");
        }
        else if (AuthState.Value.IsAuthenticated && (NavigationManager.Uri == "/Login" || NavigationManager.Uri == "/Register"))
        {
            NavigationManager.NavigateTo("/");
        }

        return Task.CompletedTask;
    }
}
