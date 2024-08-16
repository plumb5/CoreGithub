using System;
using System.Collections.Generic;

namespace P5GenralML
{
    public class MLAdminAccountInfo
    {
        public int AccountId { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string DomainName { get; set; }
        public int Visits { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime LastTrack { get; set; }
        public int Status { get; set; }
        public string Connection { get; set; }
        public int LastWeekVisits { get; set; }
        public int LastMonthVisits { get; set; }
        public DateTime TrackStartDate { get; set; }
        public int DayCount { get; set; }
        public short AccountType { get; set; }
        public int TicketStatus { get; set; }
        public string AccNameTicket { get; set; }
    }

    public class ModelAccountInfo
    {
        public int AccountId { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string DomainName { get; set; }
        public string EmailId { get; set; }
        public int Visits { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime LastTrack { get; set; }
        public int Status { get; set; }
        public List<P5GenralML.Purchase> PurchaseInfo { get; set; }
        public string AccountManager { get; set; }
        public string SupportManager { get; set; }
        public DateTime RegistrationDate { get; set; }
        public int LastSignedIn { get; set; }
        public int AccountStatus { get; set; }
        public int WeekCount { get; set; }
        public int MonthCount { get; set; }
        public int LastWeekVisits { get; set; }
        public int LastMonthVisits { get; set; }
        public double WeekPercentage { get; set; }
        public double MonthPercentage { get; set; }
        public string Connection { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public int DayCount { get; set; }
        public short AccountType { get; set; }
        public int TicketStatus { get; set; }
        public string AccNameTicket { get; set; }
        public int ExpCount { get; set; }
    }

    public class AdminAccount
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

        public byte Status { get; set; }

        public DateTime ExpiryDate { get; set; }

        public DateTime TrackStartDate { get; set; }

        public byte AccountStatus { get; set; }

        public byte ECommerceType { get; set; }

        public bool AllowSubDomain { get; set; }

        public string Timezone { get; set; }

        public string TrackerDomain { get; set; }

        public int TotalVisits { get; set; }

        public int LastWeekVisits { get; set; }

        public int LastMonthVisits { get; set; }

        public DateTime LastTrackingDate { get; set; }

        public int DayCount { get; set; }

        public int Connector { get; set; }

        public byte AccountType { get; set; }

        public string GcmProjectNo { get; set; }

        public string GcmApiKey { get; set; }

        public string PackageName { get; set; }

        public int? Scheduler { get; set; }

        public string BrandCode { get; set; }

        public string ESDataBaseName { get; set; }

        public bool? IsScriptCheckingRequired { get; set; }

        public bool? IsWebSiteDownCheckingRequired { get; set; }

        public string WebPushSubDomain { get; set; }
    }
}
