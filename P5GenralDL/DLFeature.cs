using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLFeature
    {
        public static IDLFeature GetDLFeature(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLFeatureSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLFeaturePG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
