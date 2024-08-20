using System;

namespace P5GenralML
{
    public class SmsTrackForIndividual
    {
        public int Id { get; set; }
        public string PhoneNumber { get; set; }
        public string SmsContent { get; set; }
        public int ContactId { get; set; }
        public int SmsTemplateId { get; set; }
        public string IsFormIsChatIsLmsIsMail { get; set; }
        public DateTime SentDate { get; set; }
        public bool? IsUnicodeMessage { get; set; }
        public int UserInfoUserId { get; set; }
    }
}
