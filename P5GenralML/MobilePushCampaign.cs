using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobilePushCampaign
    {
        public int Id { get; set; }
        public string? CampaignName { get; set; }
        public byte Type { get; set; }
        public string? ImageUrl { get; set; }
        public string? Title { get; set; }
        public string? Ticker { get; set; }
        public string? Message { get; set; }
        public string? SubText { get; set; }
        public string? RedirectTo { get; set; }
        public string? DeepLinkUrl { get; set; }
        public string? Parameters { get; set; }
        public string? ExternalUrl { get; set; }
        public string? ExtraButtons { get; set; }
        public byte? RuleStatus { get; set; }
        public byte? ResponseStatus { get; set; }
        public byte? Status { get; set; }
        public int Priority { get; set; }
        public int RecentEvent { get; set; }
        public DateTime? Date { get; set; }
        public string? StartDate { get; set; }
        public string? ExpiryDate { get; set; }
        public int IsAndriodIOS { get; set; }
        public byte? IsRssFeed { get; set; }
        public string? RSSFeedURL { get; set; }
        public DateTime? RSSPubDate { get; set; }
    }
}
