using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class AccountReportExport
    {
        public int AccountId { get; set; }
        public string? DomainName { get; set; }
        public string? AccountType { get; set; }
        public string? AccountManager { get; set; }
        public string? SupportManager { get; set; }
        public int Status { get; set; }
        public int WeeklyCount { get; set; }
        public int OldWeeklyCount { get; set; }
        public int MonthlyCount { get; set; }
        public int OldMonthlyCount { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ExpiryDate { get; set; }

        // Include the new fields here
        public int AnalyticsData { get; set; }
        public int ContactData { get; set; }
        public int MailSentData { get; set; }
        public int SmsSentData { get; set; }
        public int WhatsappSentData { get; set; }
        public int WebPushSentData { get; set; }

        public List<GetAccount>? GetAccountData { get; set; }
        public int AccountDataListCount { get; set; }
    }
}

