using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAllConfigURLDetails
    {
        public static IDLAllConfigURLDetails GetDLAllConfigURLDetails(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAllConfigURLDetailsSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAllConfigURLDetailsPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }

    }
}
