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
        private readonly ISubject<Message_old> _messageStream = new Subject<Message_old>();
        
        private readonly IServiceProvider serviceProvider;
        private readonly IHttpContextAccessor httpContextAccessor;
        public Chat(IServiceProvider serviceProvider, IHttpContextAccessor httpContextAccessor)
        {
            AllMessages = new ConcurrentStack<Message_old>();
            this.serviceProvider = serviceProvider;
            this.httpContextAccessor = httpContextAccessor;
        }


        public ConcurrentStack<Message_old> AllMessages { get; }

        public Message_old AddMessage(ReceivedMessage message)
        {
            var currentUserId = httpContextAccessor?.HttpContext?.User.Claims.First(c => c.Type == AuthClaimsIdentity.DefaultIdClaimType).Value;

            using (var scope = serviceProvider.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager>();
            }

            return AddMessage(new Message_old
            {
                Content = message.Content,
                SentAt = message.SentAt ?? DateTime.UtcNow,
                FromId = currentUserId,
                ToId = message.ToId
            });
        }

        public Message_old AddMessage(Message_old message)
        {
            AllMessages.Push(message);
            _messageStream.OnNext(message);
            return message;
        }

        public IObservable<Message_old> Subscribe(string userId)
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
