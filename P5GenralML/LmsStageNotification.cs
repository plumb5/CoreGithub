using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class LmsStageNotification
    {
        public int Id { get; set; }
        public Int16 LmsStageId { get; set; }
        public Boolean Mail { get; set; }
        public Boolean Sms { get; set; }
        public Boolean ReportToSeniorId { get; set; }
        public int UserGroupId { get; set; }
        public string? EmailIds { get; set; }
        public string? PhoneNos { get; set; }
        public DateTime CreatedDate { get; set; }
        public int AssignUserInfoUserId { get; set; }
        public int AssignUserGroupId { get; set; }
        public int LastAssignUserInfoUserId { get; set; }
        public Boolean IsOpenFollowUp { get; set; }
        public Boolean IsOpenNotes { get; set; }
        public string? WhatsappPhoneNos { get; set; }
        public Boolean WhatsApp { get; set; }
        public int MailTemplateId { get; set; }
        public int SmsTemplateId { get; set; }
        public int WhatsAppTemplateId { get; set; }
    }
}
