using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ContactMailSMSReminderDetails
    {
        public int Id { get; set; }
        public int TemplateId { get; set; }
        public int ContactId { get; set; }
        public string? ScheduleType { get; set; }
        public string? Name { get; set; }
        public string? EmailId { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? ReminderDate { get; set; }
        public string? ToReminderEmailId { get; set; }
        public string? ToReminderPhoneNumber { get; set; }
        public int ReminderStatus { get; set; }
        public string? FromEmailId { get; set; }
        public string? Subject { get; set; }
        public string? FromName { get; set; }
        public string? AlertScheduleStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public DateTime? AlertScheduleDate { get; set; }
        public int UserInfoUserId { get; set; }
        public string? TemplateName { get; set; }
        public string? TemplateContent { get; set; }
        public string? MailReplyEmailId { get; set; }
        public bool IsPromotionalOrTransnational { get; set; }
        public string? CCEmailId { get; set; }
        public int LmsGroupId { get; set; }
        public int LmsGroupMemberId { get; set; }
        public int Score { get; set; }
        public string? LeadLabel { get; set; }
        public string? Publisher { get; set; }
        public string? ToReminderWhatsAppPhoneNumber { get; set; }
    }
}
