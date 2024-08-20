using System;

namespace P5GenralML
{
    public class SmsBulkSentTimeSplit
    {
        public long Id { get; set; }
        public int SmsTemplateId { get; set; }
        public int SmsCampaignId { get; set; }
        public int SmsSendingSettingId { get; set; }
        public int GroupId { get; set; }
        public int ContactId { get; set; }
        public string? PhoneNumber { get; set; }
        public string? MessageContent { get; set; }
        public int SendStatus { get; set; }
        public string? P5UniqueId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ScheduleDate { get; set; }
    }
}
