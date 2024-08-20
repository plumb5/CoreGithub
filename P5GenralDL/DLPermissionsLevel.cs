using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLPermissionsLevel
    {
        public static IDLPermissionsLevel GetDLPermissionsLevel(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLPermissionsLevelSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLPermissionsLevelPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
