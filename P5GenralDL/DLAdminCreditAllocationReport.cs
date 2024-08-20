using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAdminCreditAllocationReport
    {
        public static IDLAdminCreditAllocationReport GetDLAdminCreditAllocationReport(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminCreditAllocationReportSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminCreditAllocationReportPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
