using Geesemon.DataAccess.Providers;
using Geesemon.Model.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Geesemon.DataAccess.Providers
{
    public class MessageProvider : ProviderBase<Message>, IMessageProvider
    {
        public MessageProvider(AppDbContext appDbContext)
            : base(appDbContext)
        {
        }
    }
}
