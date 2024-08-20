using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLSmsSent
    {
        public Int64 Id { get; set; }
        public int ContactId { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? SentDate { get; set; }
        public short IsDelivered { get; set; }
        public short IsClicked { get; set; }
        public bool IsResponseChecked { get; set; }
        public short NotDeliverStatus { get; set; }
        public string? ReasonForNotDelivery { get; set; }
        public string? MessageContent { get; set; }
        public short? SendStatus { get; set; }
        public int SmsTemplateId { get; set; }
        public string? CampaignJobName { get; set; }
        public string? P5SMSUniqueID { get; set; }
        public Int16 MessageParts { get; set; }
        public int UserInfoUserId { get; set; }
        public int Score { get; set; }
        public string? LeadLabel { get; set; }
        public string? Publisher { get; set; }
        public int LmsGroupMemberId { get; set; }
    }
}
