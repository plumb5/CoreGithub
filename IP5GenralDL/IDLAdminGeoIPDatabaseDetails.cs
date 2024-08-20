using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAdminGeoIPDatabaseDetails : IDisposable
    {
        Task<Int32> SaveGeoIPDatabaseDetails(AdminGeoIPDatabaseDetails geoIPDatabaseDetails);
        Task<int> MaxCount();
        Task<List<AdminGeoIPDatabaseDetails>> GetReport(int Offset, int FetchNext);
    }
}
