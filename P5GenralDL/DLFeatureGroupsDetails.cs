using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLFeatureGroupsDetails
    {
        public static IDLFeatureGroupsDetails GetDLFeatureGroupsDetails( string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLFeatureGroupsDetailsSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLFeatureGroupsDetailsPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
