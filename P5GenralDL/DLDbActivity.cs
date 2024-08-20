using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLDbActivity
    {
        public static IDLDbActivity GetDLDbActivity(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLDbActivitySQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLDbActivityPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
