using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class LmsStageNotificationSchedular
    {
        public int Id { get; set; }
        public bool Mail { get; set; }
        public bool Sms { get; set; }
        public bool ReportToSeniorId { get; set; }
        public int UserGroupId { get; set; }
        public string EmailIds { get; set; }
        public string PhoneNos { get; set; }
        public DateTime CreatedDate { get; set; }
        public int InteractiveHours { get; set; }
        public int SalesPersonNotInteractedHours { get; set; }
        public bool IsSalesPersonNotification { get; set; }
        public bool IsSalesPersonNotificationMail { get; set; }
        public bool IsSalesPersonNotificationSms { get; set; }
        public DateTime NotiToSalesPersonScheduledDate { get; set; }
        public DateTime NotiToReportingUsersScheduledDate { get; set; }
        public bool ReportToGroups { get; set; }
    }
}
