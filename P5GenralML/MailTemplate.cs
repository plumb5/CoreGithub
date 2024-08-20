using System;


namespace P5GenralML
{
    public class MLMailTemplate : MailTemplate
    {
        public string? CampaignName { get; set; }
    }

    public class MailTemplate
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public int MailCampaignId { get; set; }
        public string? Name { get; set; }
        public bool TemplateStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public double SpamScore { get; set; }
        public bool RequireCustomisedUnSububscribe { get; set; }
        public string? ContentFromSpamAssassin { get; set; }
        public string? ProductGroupName { get; set; }
        public string? TemplateDescription { get; set; }
        public string? SubjectLine { get; set; }
        public bool? IsBeeTemplate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public MailTemplate()
        {
            TemplateStatus = true;
        }
    }
}
