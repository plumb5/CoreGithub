using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLContent
    {
        public static IDLContent GetDLContent(string connection, string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new _Plumb5DLContentSQL(connection);
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new _Plumb5DLContentPG(connection);
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
