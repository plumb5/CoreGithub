using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAccountConnection
    {
        public static IDLAccountConnection GetDLAccountConnection(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAccountConnectionSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAccountConnectionPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
