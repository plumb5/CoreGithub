using System;

namespace P5GenralML
{
    public class MLSmsReport
    {
        public int Id { get; set; }
        public string? TemplateName { get; set; }
        public string? CampaignName { get; set; }
        public string? Name { get; set; }
        public string? CampaignDescription { get; set; }
        public string? SentTo { get; set; }
        public int TotalDelivered { get; set; }
        public int TotalSent { get; set; }
        public int TotalClick { get; set; }
        public int TotalNotDeliverStatus { get; set; }
        public int TotalNotSent { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public int TotalUnsubscribed { get; set; }
        public Nullable<DateTime> ScheduledDate { get; set; }
        public bool IsPromotionalOrTransactionalType { get; set; }
        public int URL { get; set; }
        public int UniqueClick { get; set; }
        public int Click { get; set; }
        public bool? IsUnicodeMessage { get; set; }
        public string? StoppedReason { get; set; }
        public int MessageParts { get; set; }
        public string? MessageContent { get; set; }
        public string? ConfigurationName { get; set; }

    }
}
