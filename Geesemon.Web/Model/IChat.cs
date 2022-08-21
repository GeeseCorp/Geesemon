using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types.Message;
using System.Collections.Concurrent;

namespace Geesemon.Web.Model
{
    public interface IChat
    {
        ConcurrentStack<Message> AllMessages { get; }

        Message AddMessage(Message message);

        Task<IObservable<Message>> Subscribe(Guid user);
    }
}
