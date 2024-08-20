using System;
using System.Collections.Generic;

namespace P5GenralML
{
    public class MLWorkFlowWebPush
    {
        public int ConfigureWebPushId { get; set; }
        public int WebPushTemplateId { get; set; }
        public Int32 SentCount { get; set; }
        public Int32 ViewCount { get; set; }
        public Int32 ClickCount { get; set; }
        public Int32 NotClickCount { get; set; }
        public Int32 CloseCount { get; set; }
        public Int32 BounceCount { get; set; }
        public DateTime Date { get; set; }
        public string? TemplateName { get; set; }
        public Int32 MachinesCount { get; set; }
        public Int32 NotSentCount { get; set; }
        public int? IsTriggerEveryActivity { get; set; }
        //public List<sendingDatalist> DataList { get; set; }
    }
    public class sendingDatalist
    {
        public int ConfigureWebPushId { get; set; }
        public int WebPushTemplateId { get; set; }
        public string? Title { get; set; }
        public string? MessageContent { get; set; }
        public string? IconImage { get; set; }
        public int  IsTriggerEveryActivity { get; set; }

    }
    public class MachineList
    {
        public string? MachineId { get; set; }
        public int ContactId { get; set; }
        public string? Name { get; set; }
        public string? RegId { get; set; }
        public string? GcmApiKey { get; set; }
        public string? GcmProjectNo { get; set; }
    }

    #region RssFeed WebPush
    public class RssFeedDataWebPush
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
    #endregion
}
