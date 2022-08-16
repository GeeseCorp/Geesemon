using Geesemon.DataAccess.Data;
using Geesemon.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Geesemon.DataAccess.Managers
{
    public interface IManager<T> : IProviderBase<T> where T : Entity
    {
    }
}
