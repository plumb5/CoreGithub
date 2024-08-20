using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public  class DLAnlyticsNotificationLog
    {
        public static IDLAnlyticsNotificationLog GetDLAnlyticsNotificationLog(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAnlyticsNotificationLogSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAnlyticsNotificationLogPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
