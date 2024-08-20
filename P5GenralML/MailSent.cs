using System;

namespace P5GenralML
{
    public class MailSent
    {
        public long Id { get; set; }
        public int MailTemplateId { get; set; }
        public int MailCampaignId { get; set; }
        public int MailSendingSettingId { get; set; }
        public int GroupId { get; set; }
        public int ContactId { get; set; }
        public string? EmailId { get; set; }
        public short Opened { get; set; }
        public short Clicked { get; set; }
        public short Forward { get; set; }
        public short Unsubscribe { get; set; }
        public string? ResponseId { get; set; }
        public short IsBounced { get; set; }
        public DateTime? SentDate { get; set; }
        public DateTime? OpenDate { get; set; }
        public DateTime? ClickDate { get; set; }
        public DateTime? ForwardDate { get; set; }
        public DateTime? UnsubscribeDate { get; set; }
        public int MultipleOpenCount { get; set; }
        public string? MultipleOpenDate { get; set; }
        public int MultipleClickCount { get; set; }
        public string? MultipleClickDate { get; set; }
        public Int16 DripSequence { get; set; }
        public Int16 DripConditionType { get; set; }
        public string? MailContent { get; set; }
        public short? SendStatus { get; set; }
        public string? ProductIds { get; set; }
        public string? P5MailUniqueID { get; set; }
        public string? ErrorMessage { get; set; }
        public string? Subject { get; set; }
        public string? FromName { get; set; }
        public string? FromEmailId { get; set; }
        public string? ReplayToEmailId { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string? CampaignJobName { get; set; }
        public string? BouncedCategory { get; set; }
        public string? BouncedErrorcode { get; set; }
        public string? OpenedDevice { get; set; }
        public string? OpenedDeviceType { get; set; }
        public string? OpenedUserAgent { get; set; }
        public string? ClickedDevice { get; set; }
        public string? ClickedDeviceType { get; set; }
        public string? ClickedUserAgent { get; set; }
        public string? ForwardedDevice { get; set; }
        public string? ForwardedDeviceType { get; set; }
        public string? ForwardedUserAgent { get; set; }
        public string? UnsubscribedDevice { get; set; }
        public string? UnsubscribedDeviceType { get; set; }
        public string? UnsubscribedUserAgent { get; set; }
        public int TriggerMailSmsId { get; set; }
        public int MailConfigurationNameId { get; set; }
        public int UserInfoUserId { get; set; }
        public int Score { get; set; }
        public string? LeadLabel { get; set; }
        public string? Publisher { get; set; }
        public int LmsGroupMemberId { get; set; }
    }
}
