using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAdminUserDetails
    {
        public static IDLAdminUserDetails GetDLAdminUserDetails(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminUserDetailsSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminUserDetailsPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
