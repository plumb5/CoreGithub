using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWhatsAppScheduled
    {

        public string TemplateName { get; set; }
        public string GroupName { get; set; }
        public int Id { get; set; }
        public Int16 ScheduledStatus { get; set; }
        public DateTime ScheduledDate { get; set; }
        public string WhatsAppCampaignName { get; set; }
        public int WhatsAppTemplateId { get; set; }
        public int WhatsAppSendingSettingId { get; set; }
        public Int16 ApprovalStatus { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CampaignDescription { get; set; }
        public string StoppedReason { get; set; }
        //public string ScheduleBatchType { get; set; }
    }
}
