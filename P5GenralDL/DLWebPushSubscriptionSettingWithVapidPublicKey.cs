using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWebPushSubscriptionSettingWithVapidPublicKey
    {
        public static IDLWebPushSubscriptionSettingWithVapidPublicKey GetDLWebPushSubscriptionSettingWithVapidPublicKey(int AccountId, string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLWebPushSubscriptionSettingWithVapidPublicKeySQL(AccountId);
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLWebPushSubscriptionSettingWithVapidPublicKeyPG(AccountId);
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
