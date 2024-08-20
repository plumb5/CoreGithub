using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAdminUserAccounts
    {
        public static IDLAdminUserAccounts GetDLAdminUserAccounts(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminUserAccountsSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLAdminUserAccountsPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
