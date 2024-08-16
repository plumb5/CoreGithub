using System;
namespace P5GenralML
{
    public class SmsTemplate
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public int SmsCampaignId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? MessageContent { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? LandingPageType { get; set; }
        public string? ProductGroupName { get; set; }
        public string? VendorTemplateId { get; set; }
        public string? DLTUploadMessageFile { get; set; }
        public bool IsPromotionalOrTransactionalType { get; set; }
        public string? Sender { get; set; }

        public bool ConvertLinkToShortenUrl { get; set; }
    }
}
