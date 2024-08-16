using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WhatsAppSendingSetting
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public string Name { get; set; }
        public int WhatsAppTemplateId { get; set; }
        public int GroupId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int TotalSent { get; set; }
        public int TotalDelivered { get; set; }
        public int TotalClick { get; set; }
        public int TotalNotSent { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int TotalUnsubscribed { get; set; }
        public int CampaignId { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public short ScheduledStatus { get; set; }
        public DateTime? ScheduledCompletedDate { get; set; }
        public int TotalContact { get; set; }
        public string StoppedReason { get; set; }
        public DateTime? StoppedDate { get; set; }
        public int TotalRead { get; set; }
        public short? IsWhatsAppOpted { get; set; }
        public int WhatsAppConfigurationNameId { get; set; }
        public bool? IsPromotionalOrTransactionalType { get; set; }

        public string? ScheduleBatchType { get; set; }
    }
}
