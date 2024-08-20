using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public static class WhatsAppGeneralBaseFactory
    {
        public static List<whatsappvendor> WhatsAppVendorList = new List<whatsappvendor>
            {
            new whatsappvendor { Name = "interakt", Domain = "interakt.in",Logo="",IconStyle="",MaxLimit=600 }
            };

        public static IBulkWhatsAppSending GetWhatsAppVendor(int accountId, WhatsAppConfiguration currentwhatsappConfigration, string jobTagName)
        {
            string VendorName = currentwhatsappConfigration.ProviderName.ToLower();
            switch (VendorName)
            {
                case "interakt": return new SendInteraktWhatsApp(accountId, currentwhatsappConfigration, jobTagName);
                default: throw new NotImplementedException("Whats App Vendor Not foud in plumb5");
            }
        }
    }

    public class whatsappvendor
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Domain { get; set; }
        public string Logo { get; set; }
        public string IconStyle { get; set; }
        public int MaxLimit { get; set; }
    }
}
