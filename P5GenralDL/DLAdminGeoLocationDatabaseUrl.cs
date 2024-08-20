using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAdminGeoLocationDatabaseUrl
    {
        public static IDLAdminGeoLocationDatabaseUrl SaveLog(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminGeoLocationDatabaseUrlSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminGeoLocationDatabaseUrlPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
