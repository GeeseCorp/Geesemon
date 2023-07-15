using Fluxor;
using Geesemon.Client.Store.Actions;
using Geesemon.Client.Store.Counter;
using Microsoft.AspNetCore.Components;

namespace Geesemon.Client.Pages;
public partial class Counter : IDisposable
{
    [Inject]
    private IState<CounterState> CounterState { get; set; }

    [Inject]
    public Fluxor.IDispatcher Dispatcher { get; set; }

    private void IncrementCount()
    {
        var action = new IncrementCounterAction();
        Dispatcher.Dispatch(action);
    }

    // Handle StateChanged event
    // rather than inherit FluxorComponent
    protected override void OnAfterRender(bool firstRender)
    {
        if (firstRender)
        {
            CounterState.StateChanged += StateChanged;
        }
    }
    public void StateChanged(object sender, EventArgs args)
    {
        InvokeAsync(StateHasChanged);
    }

    void IDisposable.Dispose()
    {
        CounterState.StateChanged -= StateChanged;
    }
}
