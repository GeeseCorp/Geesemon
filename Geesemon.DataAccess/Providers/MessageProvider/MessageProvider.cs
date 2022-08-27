using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Providers.MessageProvider
{
    public class MessageProvider : ProviderBase<Message>, IMessageProvider
    {
        public MessageProvider(AppDbContext appDbContext)
            : base(appDbContext)
        {
        }
    }
}
