using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class FormResponseReportToSetting
    {
        public int FormId { get; set; }
        public Int16 ReportToFormsMailFieldId { get; set; }
        public string? ReportToDetailsByMail { get; set; }
        public Int16 ReportToFormsSMSFieldId { get; set; }
        public string? ReportToDetailsBySMS { get; set; }
        public Int16 MailOutDependencyFieldId { get; set; }
        public string? MailIdList { get; set; }
        public string? RedirectUrl { get; set; }
        public int ReportToAssignLeadToUserIdFieldId { get; set; }
        public string? AccesLeadToUserId { get; set; }
        public string? ReportToDetailsByPhoneCall { get; set; }
        public string? GroupId { get; set; }
        public Int16 SmsOutDependencyFieldId { get; set; }
        public string? SmsSendingSettingIdList { get; set; }
        public string? WebHooks { get; set; }
        public string? WebHooksFinalUrl { get; set; }
        public string? GroupIdBasedOnOptin { get; set; }
        public string? WebHookId { get; set; }
        public string? URLParameterResponses { get; set; }
        public Boolean IsRedirectUrlNewWindow { get; set; }
        public Int16 IsOverrideAssignment { get; set; }
        public string? WhatsAppSendingSettingIdList { get; set; }
        public Int16 WhatsAppOutDependencyFieldId { get; set; }
        public Int16 ReportToFormsWhatsAppFieldId { get; set; }
        public string? ReportToDetailsByWhatsApp { get; set; }
        public string? IsOverRideSource { get; set; }
        public int SourceType { get; set; }
    }
}
