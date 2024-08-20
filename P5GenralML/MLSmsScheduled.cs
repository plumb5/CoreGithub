using System;

namespace P5GenralML
{
    public class MLSmsScheduled
    {
        public string TemplateName { get; set; }
        public string GroupName { get; set; }
        public int Id { get; set; }
        public Int16 ScheduledStatus { get; set; }
        public DateTime ScheduledDate { get; set; }
        public string SmsCampaignName { get; set; }
        public int SmsTemplateId { get; set; }
        public int SmsSendingSettingId { get; set; }
        public Int16 ApprovalStatus { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string CampaignDescription { get; set; }
        public string ScheduleBatchType { get; set; }
        public string StoppedReason { get; set; }
    }
}
