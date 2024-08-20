using System;

namespace P5GenralML
{
    public class MLSmsReportDetails
    {
        public Int64 Id { get; set; }
        public string? MessageContent { get; set; }
        public string? ProductIds { get; set; }
        public int SmsSendingSettingId { get; set; }
        public int IsDelivered { get; set; }
        public int IsClicked { get; set; }
        public int ContactId { get; set; }
        public string? PhoneNumber { get; set; }
        public string? GroupName { get; set; }
        public DateTime SentDate { get; set; }
        public string? Circle { get; set; }
        public string? Operator { get; set; }
        public string? ReasonForNotDelivery { get; set; }
        public int NotDeliverStatus { get; set; }
        public int Pending { get; set; }
        public string? MobileNumber { get; set; }
        public Nullable<DateTime> DeliveryTime { get; set; }
        public Int16? SendStatus { get; set; }
        public bool IsUnsubscribed { get; set; }
        public string? ClickedDevice { get; set; }
        public string? ClickedDeviceType { get; set; }
        public string? ResponseId { get; set; }
        public int WorkFlowId { get; set; }
    }
}
