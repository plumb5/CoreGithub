using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WhatsAppNotificationTemplate
    {
        public int Id { get; set; }
        public string? Identifier { get; set; }
        public string? WhiteListedTemplateName { get; set; }
        public string? UserAttributes { get; set; }
        public string? MediaFileURL { get; set; }
        public string? ButtonOneText { get; set; }
        public string? ButtonTwoText { get; set; }
        public string? ButtonOneDynamicURLSuffix { get; set; }
        public string? ButtonTwoDynamicURLSuffix { get; set; }
        public string? TemplateName { get; set; }
        public string? TemplateType { get; set; }
        public string? TemplateLanguage { get; set; }
        public string? TemplateContent { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsWhatsAppNotificationEnabled { get; set; }
    }
}
