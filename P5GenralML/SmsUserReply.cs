using System;

namespace P5GenralML
{
    public class SmsUserReply
    {
        public int Id { get; set; }
        public int ContactId { get; set; }
        public string? Phonenumber { get; set; }
        public string? SmsType { get; set; }
        public int SendingSettingId { get; set; }
        public string? IncomingText { get; set; }
        public string? VendorName { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
