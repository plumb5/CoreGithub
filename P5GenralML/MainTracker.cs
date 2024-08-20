using System;

namespace P5GenralML
{
    public class MainTracker
    {
        public int Id { get; set; }
        public string? PageName { get; set; }
        public string? PageNameShorten { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? CountryCode { get; set; }
        public string? VisitorIp { get; set; }
        public string? MachineId { get; set; }
        public string? Referrer { get; set; }
        public string? ReferType { get; set; }
        public string? ReferrerShort { get; set; }
        public string? RepeatOrNew { get; set; }
        public string? SearchBy { get; set; }
        public string? EmailId { get; set; }
        public string? PageTitle { get; set; }
        public DateTime Date { get; set; }
        public DateTime TimeEnd { get; set; }
        public int SessionStart { get; set; }
        public string? Network { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
        public int DeviceId { get; set; }
        public string? UserAgent { get; set; }
        public string? Browser { get; set; }
        public string? SessionId { get; set; }
        public int TranFlag { get; set; }
        public string? VisitorId { get; set; }
        public string? UtmSource { get; set; }
        public string? UtmMedium { get; set; }
        public string? UtmCampaign { get; set; }
        public string? UtmTerm { get; set; }
        public int ContactId { get; set; }
        public int PaidCampaignFlag { get; set; }

    }
}
