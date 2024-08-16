using System;

namespace P5GenralML
{
    public class MobilePushTemplate
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int CampaignId { get; set; }
        public string TemplateName { get; set; }
        public string TemplateDescription { get; set; }
        public string NotificationType { get; set; }
        public string Title { get; set; }
        public string MessageContent { get; set; }
        public string SubTitle { get; set; }
        public string ImageURL { get; set; }
        public string Button1Name { get; set; }
        public string Button1ActionType { get; set; }
        public string Button1ActionURL { get; set; }
        public string Button1IosActionURL { get; set; }
        public string Button1ClickKeyPairValue { get; set; }
        public string Button1IosClickKeyPairValue { get; set; }
        public string Button2Name { get; set; }
        public string Button2ActionType { get; set; }
        public string Button2ActionURL { get; set; }
        public string Button2IosActionURL { get; set; }
        public string Button2ClickKeyPairValue { get; set; }
        public string Button2IosClickKeyPairValue { get; set; }
        public string ClickActionType { get; set; }
        public string ClickActionURL { get; set; }
        public string ClickIosActionURL { get; set; }
        public string ClickKeyPairValue { get; set; }
        public string ClickIosKeyPairValue { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
