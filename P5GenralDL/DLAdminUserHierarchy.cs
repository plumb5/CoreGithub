using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAdminUserHierarchy
    {
        public static IDLAdminUserHierarchy GetDLAdminUserHierarchy(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminUserHierarchySQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminUserHierarchyPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
