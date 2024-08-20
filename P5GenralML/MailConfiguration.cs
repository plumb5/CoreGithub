using System;

namespace P5GenralML
{
    public class MailConfiguration
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? ProviderName { get; set; }
        public Int64 MailSent { get; set; }
        public Int64 MailLimit { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string? AccountName { get; set; }
        public string? ApiKey { get; set; }
        public Boolean IsPromotionalOrTransactionalType { get; set; }
        public bool ActiveStatus { get; set; }
        public string? DomainForImage { get; set; }
        public string? DomainForTracking { get; set; }
        public string? ConfigurationUrl { get; set; }
        public string? ResponseUrl { get; set; }
        public string? UnsubscribeUrl { get; set; }
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
        public string? HolidayListJson { get; set; }
        public bool? IsBulkSupported { get; set; }
        public string? ApiSecretKey { get; set; }
        public int MailConfigurationNameId { get; set; }
        public bool IsDefaultProvider { get; set; }
    }
}
