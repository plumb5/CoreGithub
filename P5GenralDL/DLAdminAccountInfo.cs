using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAdminAccountInfo
    {
        public static IDLAdminAccountInfo GetDLAdminAccountInfo(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminAccountInfoSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminAccountInfoPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
