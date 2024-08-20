using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class AnalyticCustomReports
    {
        public int Id { get; set; }
        public string? Referrer { get; set; }
        public string? Refertype { get; set; }
        public string? VisitorIp { get; set; }
        public string? MachineId { get; set; }
        public string? Pagename { get; set; }
        public int AccountId { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? CountryCode { get; set; }
        public DateTime? Date { get; set; }
        public DateTime? Timeend { get; set; }
        public DateTime? Previousvisit { get; set; }
        public string? Searchby { get; set; }
        public string? Flag { get; set; }
        public string? EntryPage { get; set; }
        public string? LastPage { get; set; }
        public string? Browser { get; set; }
        public string? Network { get; set; }
        public string? Repeatornew { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
        public int Pageviews { get; set; }
        public string? SessionId { get; set; }
        public string? VisitorId { get; set; }
        public double Score { get; set; }
        public short PaidCampaignFlag { get; set; }
        public int DeviceId { get; set; }
        public string? Utmsource { get; set; }
        public string? Utmmedium { get; set; }
        public string? Utmcampaign { get; set; }
        public string? Utmterm { get; set; }
        public string? DeviceBrandName { get; set; }
        public string? DeviceModelName { get; set; }
        public int CsEntryPage { get; set; }
        public int CsLastPage { get; set; }
        public bool IsCookieBlocked { get; set; }
        public short IsEventTriggered { get; set; }
        public string? P5MailUniqueId { get; set; }
        public string? P5SmsUniqueId { get; set; }
        public string? P5WhatsappUniqueId { get; set; }
        public string? P5WebPushUniqueId { get; set; }
        public bool IsCustomEventSource { get; set; }
        public bool IsFormSource { get; set; }
    }
}
