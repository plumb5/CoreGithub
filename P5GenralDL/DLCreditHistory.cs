using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLCreditHistory
    {
        public static IDLCreditHistory GetDLCreditHistory(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLCreditHistorySQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLCreditHistoryPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
