using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowMobile
    {
        public int ConfigureMobileId { get; set; }
        public int MobilePushTemplateId { get; set; }
        public Int32 ViewCount { get; set; }
        public Int32 ClickCount { get; set; }
        public Int32 CloseCount { get; set; }
        public Int32 SentCount { get; set; }
        public Int32 NotClickCount { get; set; }
        public Int32 BounceCount { get; set; }
        public DateTime Date { get; set; }
        public string? TemplateName { get; set; }
        public Int32 MachinesCount { get; set; }
        public Int32 NotSentCount { get; set; }
        public int? IsTriggerEveryActivity { get; set; }
    }

    public class AppPushCampaign
    {
        public string? TemplateName { get; set; }
        public string? SubTitle { get; set; }
        public string? MessageContent { get; set; }
        public string? Title { get; set; }
        public string? ImageUrl { get; set; }
        public int MobilePushTemplateId { get; set; }
        public int IsTriggerEveryActivity { get; set; }
    }


    public class RssFeedDataMobilePush
    {
        public int AccountId { get; set; }
        public string? Action { get; set; }
        public int CampaignId { get; set; }
        public string? Title { get; set; }
        public string? Message { get; set; }
        public string? RedirectTo { get; set; }
        public string? RssPubDate { get; set; }
        public string? RssFeedUrl { get; set; }
    }

    
}
