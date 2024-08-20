using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLPermissionDetailsForCode
    {
        public static IDLPermissionDetailsForCode GetDLPermissionDetailsForCode( string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLPermissionDetailsForCodeSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLPermissionDetailsForCodePG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
