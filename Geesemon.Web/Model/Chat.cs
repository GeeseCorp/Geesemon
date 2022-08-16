using Geesemon.DataAccess.Managers;
using Geesemon.DomainModel.Models.Auth;
using Geesemon.Model.Models;
using Geesemon.Web.GraphQL.Types.Message;
using System.Collections.Concurrent;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Geesemon.Web.Model
{
    public class Chat : IChat
    {
        private readonly ISubject<Message> _messageStream = new Subject<Message>();
        
        private readonly IServiceProvider serviceProvider;
        private readonly IHttpContextAccessor httpContextAccessor;
        public Chat(IServiceProvider serviceProvider, IHttpContextAccessor httpContextAccessor)
        {
            AllMessages = new ConcurrentStack<Message>();
            this.serviceProvider = serviceProvider;
            this.httpContextAccessor = httpContextAccessor;
        }


        public ConcurrentStack<Message> AllMessages { get; }

        public Message AddMessage(ReceivedMessage message)
        {
            var currentUserId = httpContextAccessor?.HttpContext?.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value;

            using (var scope = serviceProvider.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
            }

            return AddMessage(new Message
            {
                Content = message.Content,
                SentAt = message.SentAt ?? DateTime.UtcNow,
                FromId = currentUserId,
                ToId = message.ToId
            });
        }

        public Message AddMessage(Message message)
        {
            AllMessages.Push(message);
            _messageStream.OnNext(message);
            return message;
        }

        public IObservable<Message> Subscribe(string userId)
        {
            return _messageStream
                .Where(m => m.ToId == userId)
                .AsObservable();
        }

        public void AddError(Exception exception)
        {
            _messageStream.OnError(exception);
        }
    }
}
