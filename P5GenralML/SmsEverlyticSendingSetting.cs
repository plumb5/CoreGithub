using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class SmsEverlyticSendingSetting
    {
        public int Id { get; set; }
        public int SmsSendingSettingId { get; set; }
        public int EverlyticCampaignId { get; set; }
        public Boolean Status { get; set; }
        public int EverlyticSendSmsId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
