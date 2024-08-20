using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLVisitorInfoForBrowserRule
    {
        public static IDLVisitorInfoForBrowserRule GetDLVisitorInfoForBrowserRule(int adsId, string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLVisitorInfoForBrowserRuleSQL(adsId);
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLVisitorInfoForBrowserRulePG(adsId);
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
