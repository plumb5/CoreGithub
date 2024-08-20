using System;
namespace P5GenralML
{
    public class SmsSentError
    {
        public int Id { get; set; }
        public int SmsDataSyncId { get; set; }
        public int SmsSendingSettingId { get; set; }
        public int ContactId { get; set; }
        public string? SentDate { get; set; }
        public string? FileName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ErrorReason { get; set; }
        public string? DeliveryTime { get; set; }
        public string? MessageContent { get; set; }
        public bool IsDelivered { get; set; }
        public bool IsClicked { get; set; }
        public string? ResponseId { get; set; }
        public bool IsResponseChecked { get; set; }
        public int NotDeliverStatus { get; set; }
        public string? Circle { get; set; }
        public string? Operator { get; set; }
        public string? ReasonForNotDelivery { get; set; }
        public int ErrorCount { get; set; }
    }
}
