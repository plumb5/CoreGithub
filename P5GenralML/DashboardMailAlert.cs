using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class DashboardMailAlert
    {
        public int AlertId { get; set; }
        public int MailAlertType { get; set; }
        public int DashboardId { get; set; }
        public string ToEmailId { get; set; }
        public string CCFromEmailId { get; set; }
        public bool? IsFornightly { get; set; }
        public bool? IsDaily { get; set; }
        public bool? IsWeekly { get; set; }
        public bool? IsMonthly { get; set; }
        public bool? IsQuarterly { get; set; }
        public DateTime? LastDailyTriggerDate { get; set; }
        public DateTime? LastWeeklyTriggerDate { get; set; }
        public DateTime? LastFornightlyTriggerDate { get; set; }
        public DateTime? LastMonthlyTriggerDate { get; set; }
        public DateTime? LastQuarterlyTriggerDate { get; set; }
    }
}
