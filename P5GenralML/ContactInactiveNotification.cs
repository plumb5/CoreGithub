using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ContactInactiveNotification
    {
        public bool IsSalesPersonNotification { get; set; }
        public int SalesPersonNotificationHours { get; set; }
        public Int16 SalesPersonNotificationMail { get; set; }
        public Int16 SalesPersonNotificationSms { get; set; }
        public Int16 SalesPersonNotificationWhatsapp { get; set; }
        public bool IsReportingPersonNotification { get; set; }
        public int ReportingPersonNotificationHours { get; set; }
        public Int16 ReportingPersonNotificationMail { get; set; }
        public Int16 ReportingPersonNotificationSms { get; set; }
        public Int16 ReportingPersonNotificationWhatsapp { get; set; }

        public bool IsReportingPersonNotificationSenior { get; set; }
        public bool IsReportingPersonNotificationGroup { get; set; }
        public int ReportingPersonNotificationGroupId { get; set; }

        public DateTime LastSalesPersonNotificationDate { get; set; }
        public DateTime LastReportingPersonNotificationDate { get; set; }
    }
}
