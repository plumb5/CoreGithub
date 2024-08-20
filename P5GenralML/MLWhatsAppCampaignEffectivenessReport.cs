using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWhatsAppCampaignEffectivenessReport
    {
        public int ContactId { get; set; }
        public string PhoneNumber { get; set; }
        public int WhatsAppSendingSettingId { get; set; }
        public int IsUniqe { get; set; }
        public string UrlLink { get; set; }
    }
}
