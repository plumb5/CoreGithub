using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSmsDLTConfiguration
    {
        public static IDLSmsDLTConfiguration GetDLSmsDLTConfiguration(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLSmsDLTConfigurationSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLSmsDLTConfigurationPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
