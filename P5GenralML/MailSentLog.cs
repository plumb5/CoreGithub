using System;

namespace P5GenralML
{
    public class MailSentLog
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? ToEmailId { get; set; }
        public int MailTemplateId { get; set; }
        public int MailSendingSettingId { get; set; }
        public int ContactId { get; set; }
        public int MailCount { get; set; }
        public string? MailSource { get; set; }
        public string? MailVendor { get; set; }
        public DateTime SentDate { get; set; }
    }

    public class MailSentLogIndividualReport
    {
        public int Id { get; set; }
        public string? ToEmailId { get; set; }
        public string? Name { get; set; }
        public int MailCount { get; set; }
        public string? MailSource { get; set; }
        public string? MailVendor { get; set; }
        public DateTime SentDate { get; set; }
    }

    public class MailSentLogCampaignReport
    {
        public int Id { get; set; }
        public string? Template { get; set; }
        public int MailSendingSettingId { get; set; }
        public string? CampaignName { get; set; }
        public string? CampaignIdentifier { get; set; }
        public string? GroupName { get; set; }
        public int MailCount { get; set; }
        public string? MailVendor { get; set; }
        public string? MailSource { get; set; }
        public DateTime SentDate { get; set; }
    }
}
