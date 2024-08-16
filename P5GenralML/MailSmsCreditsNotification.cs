using System;

namespace P5GenralML
{
    public class MailSmsCreditsNotification
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool? IsNotificationSent { get; set; }
        public DateTime? SentDate { get; set; }
        public string SentMailIds { get; set; }
        public bool? IsNotificationChecked { get; set; }
        public DateTime? NotificationCheckedDate { get; set; }
        public string CheckedIpAddress { get; set; }
    }
}
