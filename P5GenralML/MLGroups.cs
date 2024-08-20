using System;


namespace P5GenralML
{
    public class MLGroups
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? GroupDescription { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public int Total { get; set; }
        public int UnVerified { get; set; }
        public int Verified { get; set; }
        public int InValid { get; set; }
        public Boolean DisplayInUnscubscribe { get; set; }
        public Int16 GroupType { get; set; }
        public int Unsubscribe { get; set; }
        public int MailSubscribe { get; set; }
        public int SmsUnsubscribe { get; set; }
        public int SmsSubscribe { get; set; }
        public int WhatsAppUnsubscribe { get; set; }
        public int WhatsAppSubscribe { get; set; }
        public int WebPushUnsubscribe { get; set; }
        public int WebPushSubscribe { get; set; }
        public int TotalEmail { get; set; }
        public int TotalPhonenumber { get; set; }
    }
}
