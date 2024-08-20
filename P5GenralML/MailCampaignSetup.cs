using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MailCampaignSetup
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public int MailSendingSettingId { get; set; }
        public string CampaignIdentifier { get; set; }
        public int CampaignId { get; set; }
        public string CampaignName { get; set; }
        public string MailSubject { get; set; }
        public int MailTemplateId { get; set; }
        public string MailTemplateName { get; set; }
        public int GroupId { get; set; }
        public string GroupName { get; set; }
        public string FromName { get; set; }
        public string FromEmailId { get; set; }
        public string ReplyTo { get; set; }
        public DateTime? CampaignExpiryDate { get; set; }
        public string DownLoadFilename { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string ApprovalSentTo { get; set; }
        public bool? IsApproved { get; set; }
        public string ApprovedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }
    }
}
