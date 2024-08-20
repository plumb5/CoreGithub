using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLNotifications
    {
        public static IDLNotifications GetDLNotifications(int AccountId, string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLNotificationsSQL(AccountId);
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLNotificationsPG(AccountId);
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }

    }
}
