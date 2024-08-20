using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WhatsAppTemplates
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public int WhatsAppCampaignId { get; set; }
        public string? Name { get; set; }
        public string? TemplateDescription { get; set; }
        public string? TemplateType { get; set; }
        public string? WhitelistedTemplateName { get; set; }
        public string? TemplateContent { get; set; }
        public string? TemplateLanguage { get; set; }
        public string? UserAttributes { get; set; }
        public bool IsButtonAdded { get; set; }
        public string? ButtonOneAction { get; set; }
        public string? ButtonOneText { get; set; }
        public string? ButtonOneType { get; set; }
        public string? ButtonOneURLType { get; set; }
        public string? ButtonOneDynamicURLSuffix { get; set; }
        public string? ButtonTwoAction { get; set; }
        public string? ButtonTwoText { get; set; }
        public string? ButtonTwoType { get; set; }
        public string? ButtonTwoURLType { get; set; }
        public string? ButtonTwoDynamicURLSuffix { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string? MediaFileURL { get; set; }
        public string? TemplateFooter { get; set; }
        public bool ConvertLinkToShortenUrl { get; set; }
    }
}
