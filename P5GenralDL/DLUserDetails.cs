using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLUserDetails
    {
        public static IDLUserDetails GetDLUserDetails(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLUserDetailsSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLUserDetailsPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
