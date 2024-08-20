using System;

namespace P5GenralML
{
    public class MailSentError
    {
        public int Id { get; set; }
        public int MailDataSyncId { get; set; }
        public int MailSendingSettingId { get; set; }
        public string EmailId { get; set; }
        public string MailFileName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string ErrorReason { get; set; }
    }
}
