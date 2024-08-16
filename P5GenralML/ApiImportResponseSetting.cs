using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ApiImportResponseSetting
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Status { get; set; }
        public string ReportToDetailsByMail { get; set; }
        public string ReportToDetailsBySMS { get; set; }
        public string ReportToDetailsByWhatsApp { get; set; }
        public int MailSendingSettingId { get; set; }
        public int SmsSendingSettingId { get; set; }
        public int WhatsAppSendingSettingId { get; set; }
        public int AssignLeadToUserInfoUserId { get; set; }
        public Int16 IsOverrideAssignment { get; set; }
        public int AssignToGroupId { get; set; }
        public string WebHookId { get; set; }
        public string URLParameterResponses { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public Nullable<DateTime> UpdatedDate { get; set; }
        public bool IsVerifiedEmail { get; set; }
        public bool IsAutoWhatsApp { get; set; }
        public bool IsAutoClickToCall { get; set; }
        public int AssignUserGroupId { get; set; }
        public int LastAssignUserInfoUserId { get; set; }
        public int IsOverRideSource { get; set; }
        public bool IsConditional { get; set; }
        public string ConditionalJson { get; set; }
        public int SourceType { get; set; }
        public bool IsUserAssignmentConditional { get; set; }
        public string UserAssigmentJson { get; set; }
        public string MailSendingConditonalJson { get; set; }
        public string SmsSendingConditonalJson { get; set; }
        public string WhatsAppSendingConditonalJson { get; set; }
        public bool IsMailRepeatCon { get; set; }
        public bool IsSmsRepeatCon { get; set; }
        public bool IsWhatsappRepeatCon { get; set; }
        public bool IsCallRepeatCon { get; set; }
        public int AssignStage { get; set; }
        public string AssignStageConditonalJson { get; set; }
        public bool IsIncludedLeads { get; set; }
        public string IncludedLeadsJson { get; set; }
        public bool IsExcludedLeads { get; set; }
        public string ExcludedLeadsJson { get; set; }
        public string AssignToGroupConditonalJson { get; set; }
        public bool IsUnConditionalGroupSticky { get; set; }
    }
}
