using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWebLogger
    {
        public static IDLWebLogger GetDLWebLogger(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLWebLoggerSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLWebLoggerPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
