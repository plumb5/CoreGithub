using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWorkFlowSmsBulkSentInitiation
    {
        public static IDLWorkFlowSmsBulkSentInitiation GetDLWorkFlowSmsBulkSentInitiation(int AccountId, string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLWorkFlowSmsBulkSentInitiationSQL(AccountId);
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLWorkFlowSmsBulkSentInitiationPG(AccountId);
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
