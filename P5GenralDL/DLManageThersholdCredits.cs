using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLManageThersholdCredits
    {
        public static IDLManageThersholdCredits GetDLManageThersholdCredits(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLManageThersholdCreditsSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLManageThersholdCreditsPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
