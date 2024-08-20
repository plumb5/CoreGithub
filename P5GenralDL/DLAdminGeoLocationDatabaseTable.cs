using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAdminGeoLocationDatabaseTable
    {
        public static IDLAdminGeoLocationDatabaseTable GetDLAdminGeoLocationDatabaseTable(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminGeoLocationDatabaseTableSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminGeoLocationDatabaseTablePG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
