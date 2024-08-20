using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLFeatureUnitType
    {
        public static IDLFeatureUnitType GetDLFeatureUnitType(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLFeatureUnitTypeSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLFeatureUnitTypePG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
