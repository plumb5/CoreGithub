using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class CRMFilterCondition
    {
        public int Id { get; set; }
        public string ConditionIdentifier { get; set; }
        public string ConditionJson { get; set; }
        public string ConditionQuery { get; set; }
        public int SMSTemplateId { get; set; }
        public bool SMSIsPromotionalOrTransactional { get; set; }
        public int MailTemplateId { get; set; }
        public bool MailIsPromotionalOrTransactional { get; set; }
        public string MailSubject { get; set; }
        public string MailFromName { get; set; }
        public string MailFromEmailId { get; set; }
        public string MailReplyToEmailId { get; set; }
        public int WhatsAppHsmType { get; set; }
        public int GroupId { get; set; }
        public bool IsAddToGroup { get; set; }
        public bool IsRemoveFromGroup { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsActive { get; set; }
    }
}
