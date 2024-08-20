using System;

namespace P5GenralML
{
    public class MLMailDripForMails
    {
        public int Id { get; set; }
        public int MailTemplateId { get; set; }
        public string? TemplateName { get; set; }
        public string? DripSubject { get; set; }
        public string? GroupName { get; set; }
        public short DripSequence { get; set; }
        public short DripConditionType { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public string? MailCampaignName { get; set; }
        public int TotalSent { get; set; }
        public int TotalOpen { get; set; }
        public int TotalClick { get; set; }
        public int TotalUnsubscribe { get; set; }
        public int TotalForward { get; set; }
        public int TotalBounced { get; set; }
        public int TotalNotSent { get; set; }
    }
}
