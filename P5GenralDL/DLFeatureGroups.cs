using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLFeatureGroups
    {
        public static IDLFeatureGroups GetDLFeatureGroups(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLFeatureGroupsSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLFeatureGroupsPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
