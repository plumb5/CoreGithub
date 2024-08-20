using System;

namespace P5GenralML
{
    public class SmsConfiguration
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string ProviderName { get; set; }
        public bool IsDefaultProvider { get; set; }
        public Int64 SmsSent { get; set; }
        public Int64 SmsLimit { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string ApiKey { get; set; }
        public string Sender { get; set; }
        public bool IsPromotionalOrTransactionalType { get; set; }
        public string Password { get; set; }
        public string UserName { get; set; }
        public bool ActiveStatus { get; set; }
        public bool? IsTimeRestriction { get; set; }
        public bool? WeekDays { get; set; }
        public TimeSpan? WeekDayStartTime { get; set; }
        public TimeSpan? WeekDayEndTime { get; set; }
        public bool? Saturday { get; set; }
        public TimeSpan? SaturdayStartTime { get; set; }
        public TimeSpan? SaturdayEndTime { get; set; }
        public bool? Sunday { get; set; }
        public TimeSpan? SundayStartTime { get; set; }
        public TimeSpan? SundayEndTime { get; set; }
        public bool? Holiday { get; set; }
        public TimeSpan? HolidayStartTime { get; set; }
        public TimeSpan? HolidayEndTime { get; set; }
        public string HolidayListJson { get; set; }
        public bool? IsBulkSupported { get; set; }
        public string ConfigurationUrl { get; set; }
        public string EntityId { get; set; }
        public string TelemarketerId { get; set; }
        public bool? DLTRequired { get; set; }
        public string? DLTOperatorName { get; set; }
        public Int32 SmsConfigurationNameId { get; set; }
        public string ConfigurationName { get; set; }
    }
}
