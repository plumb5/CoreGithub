using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLUserGroup
    {
        public static IDLUserGroup GetDLUserGroup(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLUserGroupSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLUserGroupPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
