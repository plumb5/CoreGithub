using System;

namespace P5GenralML
{
    public class SmsCampaignSetup
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public int SmsSendingSettingId { get; set; }
        public bool IsPromotionalOrTransactionalType { get; set; }
        public string? CampaignIdentifier { get; set; }
        public int CampaignId { get; set; }
        public string? CampaignName { get; set; }
        public int SmsTemplateId { get; set; }
        public string? SmsTemplateName { get; set; }
        public int GroupId { get; set; }
        public string? GroupName { get; set; }
        public DateTime? CampaignExpiryDate { get; set; }
        public string? DownLoadFilename { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? ApprovalSentTo { get; set; }
        public bool? IsApproved { get; set; }
        public string? ApprovedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }
    }
}
