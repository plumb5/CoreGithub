using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWhatsappShortUrl
    {
        public static IDLWhatsappShortUrl GetDLWhatsappShortUrl(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLWhatsappShortUrlSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLWhatsappShortUrlPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
