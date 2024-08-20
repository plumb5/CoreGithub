using System;

namespace P5GenralML
{
    public class MailClick
    {
        public int Id { get; set; }
        public int MailSendingSettingId { get; set; }
        public int ContactId { get; set; }
        public string? TrackIp { get; set; }
        public string? UrlLink { get; set; }
        public DateTime ClickedDate { get; set; }
        public int TriggerMailSmsId { get; set; }
        public string? P5MailUniqueID { get; set; }
    }
}
