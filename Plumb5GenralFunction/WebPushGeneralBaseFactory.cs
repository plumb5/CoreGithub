using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public static class WebPushGeneralBaseFactory
    {
        public static List<pushvendor> PushVendorList = new List<pushvendor>()
        {
            new pushvendor { Name = "vapid", Domain = "vapid.com",Logo="vapidlogo",IconStyle="vapid",MaxLimit=1000 },
            new pushvendor { Name = "fcm", Domain = "fcm.com" ,Logo="fcmlogo",IconStyle="fcm",MaxLimit=1000}
        };

        public static IBulkWebPushSending GetPushVendor(int accountId, int WebPushTemplateId, WebPushSettings webpushprovidersetting, string jobTagName, string? sqlVendor = null)
        {
            string VendorName = webpushprovidersetting.ProviderName.ToLower();
            switch (VendorName)
            {
                case "vapid": return new SendVapidWebPush(accountId, WebPushTemplateId, webpushprovidersetting, jobTagName, sqlVendor);
                default: throw new NotImplementedException("Push Vendor Not foud in plumb5");
            }
        }
    }

    public class pushvendor
    {
        public string Name { get; set; }
        public string Domain { get; set; }
        public string Logo { get; set; }
        public string IconStyle { get; set; }
        public int MaxLimit { get; set; }
    }
}
