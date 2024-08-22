namespace Plumb5.Areas.Revenue.Dto
{
    public record RevenueChannels_GetEventnamesDto(int AccountId);
    public record RevenueChannels_GetDayWiseRevenueDto(int AccountId, int CustomEventOverViewId, string fromDateTime, string toDateTime);
    public record RevenueChannels_GetChannelCountDto(int AccountId, int CustomEventOverViewId, string fromDateTime, string toDateTime);
    public record RevenueChannels_GetRevenueMaxCountDto(int AccountId, string Channel, int CustomEventOverViewId, string fromDateTime, string toDateTime);
    public record RevenueChannels_GetRevenueDataDto(int AccountId, string Channel, int CustomEventOverViewId, string fromDateTime, string toDateTime, int OffSet, int FetchNext);
    public record RevenueChannels_ExportDto(int AccountId, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
