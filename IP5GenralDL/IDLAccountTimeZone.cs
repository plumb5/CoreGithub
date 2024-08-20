using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAccountTimeZone:IDisposable
    {
        Task<AccountTimeZone?> GET();
        Task<Int32> Save(string TimeZone, int AccountID = 0, string? TimeZoneTitle = null);
    }
}
