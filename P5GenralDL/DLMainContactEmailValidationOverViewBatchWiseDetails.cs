using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLMainContactEmailValidationOverViewBatchWiseDetails
    {
        public static IDLMainContactEmailValidationOverViewBatchWiseDetails GetDLMainContactEmailValidationOverViewBatchWiseDetails(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLMainContactEmailValidationOverViewBatchWiseDetailsSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLMainContactEmailValidationOverViewBatchWiseDetailsPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
