using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Prospect.Models
{
    [Area("Prospect")]
    public class InActiveNotificationValidation
    {
        public InActiveNotificationValidation()
        {

        }

        public bool ValidateInActivateNotificationDetails(ContactInactiveNotification lmsNotification)
        {
            if (lmsNotification.IsSalesPersonNotification && lmsNotification.SalesPersonNotificationMail != 1 && lmsNotification.SalesPersonNotificationSms != 1)
                throw new ArgumentException("Please select Mail or Sms for Sales Person");
            else if (lmsNotification.IsReportingPersonNotification && lmsNotification.ReportingPersonNotificationMail != 1 && lmsNotification.ReportingPersonNotificationSms != 1)
                throw new ArgumentException("Please select Mail or Sms for Reporting Person");
            else if (lmsNotification.IsReportingPersonNotification && !lmsNotification.IsReportingPersonNotificationSenior && !lmsNotification.IsReportingPersonNotificationGroup)
                throw new ArgumentException("Please select Senior or Group");

            return true;
        }
    }
}