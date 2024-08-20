using System;

namespace P5GenralML
{
    public class MLSmsVendorResponse
    {
        public long Id { get; set; }
        public int SmsSendingSettingId { get; set; }
        public int ContactId { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ResponseId { get; set; }
        public short NotDeliverStatus { get; set; }
        public string? ReasonForNotDelivery { get; set; }
        public string? MessageContent { get; set; }
        public Int16 SendStatus { get; set; }
        public string? ProductIds { get; set; }
        public string? VendorName { get; set; }
        public int SmsTemplateId { get; set; }
        public int GroupId { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string? CampaignJobName { get; set; }
        public bool IsUnicodeMessage { get; set; }

        public int TriggerMailSMSId { get; set; }
        public string? P5SMSUniqueID { get; set; }
        public Int16 MessageParts { get; set; }
    }
}
