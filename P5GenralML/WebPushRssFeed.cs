using System;

namespace P5GenralML
{
    public class WebPushRssFeed
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int CampaignId { get; set; }
        public string? CampaignName { get; set; }
        public string? RssUrl { get; set; }
        public int GroupId { get; set; }
        public string? CheckRssFeedEvery { get; set; }
        public bool IsAdvancedOptions { get; set; }
        public bool IsAutoHide { get; set; }
        public bool IsAndroidBadgeDefaultOrCustom { get; set; }
        public string? ImageUrl { get; set; }
        public string? UploadedIconFileName { get; set; }
        public string? UploadedIconUrl { get; set; }
        public bool Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public DateTime? RssFeedPublishedDate { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? RedirectTo { get; set; }
    }
}
