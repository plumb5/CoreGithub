using System;

namespace P5GenralML
{
    public class Account
    {
        public int AccountId { get; set; }
        public int UserInfoUserId { get; set; }
        public string AccountName { get; set; }
        public string DomainName { get; set; }
        public string AssociatedDomains { get; set; }
        public string AccountDescription { get; set; }
        public string Connection { get; set; }
        public string Script { get; set; }
        public string SinglePageScript { get; set; }
        public DateTime CreatedDate { get; set; }
        public short Status { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime TrackStartDate { get; set; }
        public short AccountStatus { get; set; }
        public short ECommerceType { get; set; }
        public bool AllowSubDomain { get; set; }
        public string Timezone { get; set; }
        public string TrackerDomain { get; set; }
        public int TotalVisits { get; set; }
        public int LastWeekVisits { get; set; }
        public int LastMonthVisits { get; set; }
        public DateTime LastTrackingDate { get; set; }
        public int DayCount { get; set; }
        public int Connector { get; set; }
        public short AccountType { get; set; }
        public string GcmProjectNo { get; set; }
        public string GcmApiKey { get; set; }
        public string PackageName { get; set; }
        public int Scheduler { get; set; }
        public string BrandCode { get; set; }
        public string ESDataBaseName { get; set; }
        public bool IsScriptCheckingRequired { get; set; }
        public bool IsWebSiteDownCheckingRequired { get; set; }
        public string WebPushSubDomain { get; set; }
        public bool IsCustomTrackingScript { get; set; }
    }
}
