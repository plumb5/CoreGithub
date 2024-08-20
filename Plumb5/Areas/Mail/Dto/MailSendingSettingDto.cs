namespace Plumb5.Areas.Mail.Dto
{
    public class MailSendingSettingDto
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public string? Name { get; set; }
        public int MailTemplateId { get; set; }
        public int GroupId { get; set; }
        public string? Subject { get; set; }
        public string? FromName { get; set; }
        public string? FromEmailId { get; set; }
        public bool Subscribe { get; set; }
        public bool Forward { get; set; }
        public string? ReplyTo { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public bool IsPromotionalOrTransactionalType { get; set; }
        public int TotalSent { get; set; }
        public int TotalOpen { get; set; }
        public int TotalClick { get; set; }
        public int TotalUnsubscribe { get; set; }
        public int TotalForward { get; set; }
        public int TotalBounced { get; set; }
        public int TotalNotSent { get; set; }
        public Nullable<DateTime> UpdatedDate { get; set; }
        public int CampaignId { get; set; }
        public string? ScheduledDate { get; set; }
        public Int16 ScheduledStatus { get; set; }
        public Nullable<DateTime> ScheduledCompletedDate { get; set; }
        public bool? IsMailSplit { get; set; }
        public int SplitContactPercentage { get; set; }
        public string? SplitIdentifier { get; set; }
        public string? SplitVariation { get; set; }
        public int TotalContact { get; set; }
        public string? StoppedReason { get; set; }
        public DateTime? StoppedDate { get; set; }
        public string? ABWinningMetricRate { get; set; }
        public int ABTestDuration { get; set; }
        public string? FallbackTemplate { get; set; }
        public int MailConfigurationNameId { get; set; }
    }
}
