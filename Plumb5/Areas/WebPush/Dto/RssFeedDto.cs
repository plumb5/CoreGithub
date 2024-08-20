using P5GenralML;

namespace Plumb5.Areas.WebPush.Dto
{
    public record RssFeedDto_Save(int AccountId, WebPushRssFeed webPushRssFeed);
    public record RssFeedDto_GetRssFeedDetails(int AccountId, WebPushRssFeed webPushRssFeed);
    public record RssFeedDto_SendIndividaulWebPushRssFeedTest(int AccountId, WebPushRssFeed webPushRssFeed, string MachineId);
    public record RssFeedDto_SendGroupWebPushRssFeedTest(int AccountId, WebPushRssFeed webPushRssFeed, int GroupId);
    public record RssFeedDto_ValidateRSSFeedURL(string RssFeedUrl);
}
