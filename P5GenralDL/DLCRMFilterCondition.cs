using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLCRMFilterCondition
    {
        public static IDLCRMFilterCondition GetDLCRMFilterCondition(int AccountId, string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLCRMFilterConditionSQL(AccountId);
            }
            
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
