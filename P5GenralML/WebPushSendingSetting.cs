using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WebPushSendingSetting
    {
        public int Id { get; set; }
        public int UserGroupId { get; set; }
        public int UserInfoUserId { get; set; }
        public string Name { get; set; }
        public int WebPushTemplateId { get; set; }
        public int GroupId { get; set; }
        public int TotalSent { get; set; }
        public int TotalClick { get; set; }
        public int TotalView { get; set; }
        public int TotalClose { get; set; }
        public int TotalUnsubscribed { get; set; }
        public int TotalNotSent { get; set; }
        public int CampaignId { get; set; }
        public Int16 ScheduledStatus { get; set; }
        public DateTime ScheduledCompletedDate { get; set; }
        public DateTime ScheduledDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string StoppedReason { get; set; }
        public DateTime? StoppedDate { get; set; }
    }
}
