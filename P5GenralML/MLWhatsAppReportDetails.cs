using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWhatsAppReportDetails
    {

        public Int64 Id { get; set; }
        public int WhatsAppSendingSettingId { get; set; }
        public int IsDelivered { get; set; }
        public int IsClicked { get; set; }
        public int IsRead { get; set; }
        public byte? SendStatus { get; set; }
        public string? ErrorMessage { get; set; }
        public bool IsUnsubscribed { get; set; }
        public int WorkFlowId { get; set; }
        public string? MessageContent { get; set; }
        public int ContactId { get; set; }
        public string? PhoneNumber { get; set; }
        public string? GroupName { get; set; }
        public DateTime SentDate { get; set; }
        public int IsFailed { get; set; }
        public Nullable<DateTime> DeliveredDate { get; set; }
        public string? ClickedDevice { get; set; }
        public string? ClickedDeviceType { get; set; }
        public string? ResponseId { get; set; }

    }
}
