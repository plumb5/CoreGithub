using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAnlyticsNotificationLog : IDisposable
    {
        Task<Int32> Save(AnlyticsNotificationLog log);
        Task<bool> Update(AnlyticsNotificationLog log);
        Task<IEnumerable<AnlyticsNotificationLog>> GetDetails(int Accountid);
    }
}
