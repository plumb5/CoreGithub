using System;

namespace P5GenralML
{
    public class SmsSent
    {
        public Int64 Id { get; set; }
        public int SmsSendingSettingId { get; set; }
        public int ContactId { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? SentDate { get; set; }
        public short IsDelivered { get; set; }
        public short IsClicked { get; set; }
        public string? ResponseId { get; set; }
        public bool IsResponseChecked { get; set; }
        public short NotDeliverStatus { get; set; }
        public string? Circle { get; set; }
        public string? Operator { get; set; }
        public string? ReasonForNotDelivery { get; set; }
        public DateTime? DeliveryTime { get; set; }
        public string? MessageContent { get; set; }
        public short? SendStatus { get; set; }
        public string? ProductIds { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? VendorName { get; set; }
        public int SmsTemplateId { get; set; }
        public int GroupId { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string? CampaignJobName { get; set; }
        public string? ClickedDevice { get; set; }
        public string? ClickedDeviceType { get; set; }
        public string? ClickedUserAgent { get; set; }
        public bool? IsUnsubscribed { get; set; }
        public DateTime? UnsubscribedDate { get; set; }
        public bool? IsUnicodeMessage { get; set; }

        public int TriggerMailSMSId { get; set; }
        public string? VendorTemplateId { get; set; }
        public string? P5SMSUniqueID { get; set; }
        public Int16 MessageParts { get; set; }
        public int SmsConfigurationNameId { get; set; }
        public int UserInfoUserId { get; set; }
        public int Score { get; set; }
        public string? LeadLabel { get; set; }
        public string? Publisher { get; set; }
        public int LmsGroupMemberId { get; set; }
    }
}
