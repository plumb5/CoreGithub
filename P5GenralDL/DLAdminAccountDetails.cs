using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAdminAccountDetails
    {
        public static IDLAdminAccountDetails GetDLAdminAccountDetails(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminAccountDetailsSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminAccountDetailsPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
