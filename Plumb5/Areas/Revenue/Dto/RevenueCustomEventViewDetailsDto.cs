using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Revenue.Dto
{
    public record RevenueCustomEventViewDetails_MaxCountDto(int accountId, int customeventoverviewid, string fromDateTime, string toDateTime, string Channel = "", int CampaignId = 0, string EventName = "", Int16 CampignType = 0);
    public record RevenueCustomEventViewDetails_GetRevenueCstDetailsDto(int accountId, int customeventoverviewid, string fromDateTime, string todatetime, int OffSet, int FetchNext, string Channel = "", int CampaignId = 0, string EventName = "", Int16 CampignType = 0);
    public record RevenueCustomEventViewDetails_GetEventExtraFieldDataDto(int accountId, int customEventOverViewId);
    public record RevenueCustomEventViewDetails_GetEventsDetailsDto(int accountId, int customeventoverviewid, int Id);
    public record RevenueCustomEventViewDetails_RevenueExportCstEvtDetailsReportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
