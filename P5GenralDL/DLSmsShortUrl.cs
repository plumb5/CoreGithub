using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSmsShortUrl
    {
        public static IDLSmsShortUrl GetDLSmsShortUrl( string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLSmsShortUrlSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLSmsShortUrlPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
