using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ContactNotificationRule
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Boolean Mail { get; set; }
        public Boolean Sms { get; set; }
        public Boolean WhatsApp { get; set; }
        public string Conditions { get; set; }
        public int AssignUserInfoUserId { get; set; }
        public int AssignUserGroupId { get; set; }
        public int LastAssignUserInfoUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public Boolean? Status { get; set; }
        public Int16 RulePriority { get; set; }
        public int AutoMailSendingSettingId { get; set; }
        public int AutoSmsSendingSettingId { get; set; }
        public int AutoWhatsAppSendingSettingId { get; set; }
        public int AutoAssignToGroupId { get; set; }
        public int AutoAssignToLmsSourceId { get; set; }
    }
}
