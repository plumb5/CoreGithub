using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLPermissionSubLevels
    {
        public static IDLPermissionSubLevels GetDLPermissionSubLevels(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLPermissionSubLevelsSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLPermissionSubLevelsPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
