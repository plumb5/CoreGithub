using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSmsNotificationTemplate
    {
        public static IDLSmsNotificationTemplate GetDLSmsNotificationTemplate(int AccountId, string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLSmsNotificationTemplateSQL(AccountId);
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLSmsNotificationTemplatePG(AccountId);
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }

    }
}
