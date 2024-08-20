using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.WebPush.Dto
{
    public record WebPushCampaignResponseReport_MaxCountDto(int accountId, MLWebPushCampaignResponseReport webpushReport, string fromDateTime, string toDateTime);
    public record WebPushCampaignResponseReport_GetReportDetailsDto(int accountId, MLWebPushCampaignResponseReport webpushReport, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
    public record WebPushCampaignResponseReport_ExportDto(int AccountId, int OffSet, int FetchNext, string FileType, string fromDateTime, string toDateTime);


    }
