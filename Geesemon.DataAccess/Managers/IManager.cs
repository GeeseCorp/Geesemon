using Geesemon.DataAccess.Providers;
using Geesemon.Model.Common;

namespace Geesemon.DataAccess.Managers
{
    public interface IManager<T> : IProviderBase<T> where T : Entity
    {
    }
}
