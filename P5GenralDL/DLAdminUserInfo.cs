using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAdminUserInfo
    {
        public static IDLAdminUserInfo GETDLAdminUserInfo(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminUserInfoSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminUserInfoPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
