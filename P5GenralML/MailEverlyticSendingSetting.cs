using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MailEverlyticSendingSetting
    {
        public int Id { get; set; }
        public int MailSendingSettingId { get; set; }
        public int EverlyticCampaignId { get; set; }
        public Boolean Status { get; set; }
        public int EverlyticSendMailId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
