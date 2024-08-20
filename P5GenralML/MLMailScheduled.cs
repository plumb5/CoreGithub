using System;

namespace P5GenralML
{
    public class MLMailScheduled
    {
        public string? TemplateName { get; set; }
        public string? Subject { get; set; }
        public string? GroupName { get; set; }
        public int DripSequence { get; set; }
        public int DripConditionType { get; set; }
        public int Id { get; set; }
        public Int16 ScheduledStatus { get; set; }
        public DateTime ScheduledDate { get; set; }
        public string? MailCampaignName { get; set; }
        public int IsDripType { get; set; }
        public int MailTemplateId { get; set; }
        public int MailSendingSettingId { get; set; }
        public Int16 ApprovalStatus { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string? CampaignDescription { get; set; }
        public bool IsMailSplit { get; set; }
        public DateTime? ScheduledCompletedDate { get; set; }
        public string? StoppedReason { get; set; }
    }
}
