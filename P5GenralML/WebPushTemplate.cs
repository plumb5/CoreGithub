using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WebPushTemplate
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int CampaignId { get; set; }
        public string? TemplateName { get; set; }
        public string? TemplateDescription { get; set; }
        public int NotificationType { get; set; }
        public string? Title { get; set; }
        public string? MessageContent { get; set; }
        public string? IconImage { get; set; }
        public string? OnClickRedirect { get; set; }
        public string? BannerImage { get; set; }
        public string? Button1_Label { get; set; }
        public string? Button1_Redirect { get; set; }
        public string? Button2_Label { get; set; }
        public string? Button2_Redirect { get; set; }
        public bool IsAutoHide { get; set; }
        public bool IsCustomBadge { get; set; }
        public string? BadgeImage { get; set; }
        public bool IsArchive { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
