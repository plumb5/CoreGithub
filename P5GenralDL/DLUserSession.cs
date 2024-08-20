using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLUserSession
    {
        public static IDLUserSession GetDLUserSession(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLUserSessionSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLUserSessionPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
