using System;

namespace P5GenralML
{
    public class DayWiseConsumption
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int UserId { get; set; }
        public DateTime ConsumptionDate { get; set; }
        public int? TotalMailSent { get; set; }
        public DateTime? MailCountUpdatedDate { get; set; }
        public int? TotalSmsSent { get; set; }
        public DateTime? SmsCountUpdatedDate { get; set; }
        public int? TotalSpamCheck { get; set; }
        public DateTime? SpamCountUpdatedDate { get; set; }
        public int? TotalEmailVerified { get; set; }
        public DateTime? EmailVerifyCountUpdatedDate { get; set; }
        public int? TotalWebPushSent { get; set; }
        public DateTime? WebPushCountUpdatedDate { get; set; }
        public int? TotalMobilePushSent { get; set; }
        public DateTime? MobilePushUpdatedDate { get; set; }
        public int? TotalWhatsappSent { get; set; }
        public DateTime? WhatsappSentCountUpdatedDate { get; set; }
    }
}
