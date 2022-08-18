using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types.Message;
using System.Collections.Concurrent;

namespace Geesemon.Web.Model
{
    public interface IChat
    {
        ConcurrentStack<Message_old> AllMessages { get; }

        Message_old AddMessage(Message_old message);

        IObservable<Message_old> Subscribe(string user);

        Message_old AddMessage(ReceivedMessage message);
    }
}
