using Fluxor;
using Geesemon.Client.Store.Actions;

namespace Geesemon.Client.Store.Counter
{
    public static class Reducers
    {
        [ReducerMethod]
        public static CounterState ReduceIncrementCounterAction(CounterState state, 
            IncrementCounterAction action) =>
                new CounterState(clickCount: state.ClickCount + action.Increment);
    }
}
