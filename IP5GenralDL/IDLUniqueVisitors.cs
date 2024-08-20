using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLUniqueVisitors : IDisposable
    {
        Task<object> Select_UniqueVisitsMaxCount(_Plumb5MLUniqueVisits mlObj);
        Task<DataSet> Select_UniqueVisits(_Plumb5MLUniqueVisits mlObj);
        Task<DataSet> GetCachedUniqueVisitsMaxCount(_Plumb5MLUniqueVisits mlObj);
        Task<DataSet> GetCachedUniqueVisits(_Plumb5MLUniqueVisits mlObj);
        Task<DataSet> SelectUnique_DeviceDetailsCount(_Plumb5MLGetDevices mlObj);
        Task<DataSet> SelectDeviceUniqueVisits(_Plumb5MLUniqueVisits mlObj);
    }
}
