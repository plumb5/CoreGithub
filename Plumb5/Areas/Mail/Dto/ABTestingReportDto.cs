using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Mail.Dto
{
    public record ABTestingReport_MaxCountDto(int mailCampaignId, string fromDateTime, string toDateTime);
    public record ABTestingReport_GetResponseDataDto(int mailCampaignId, string fromDateTime, string toDateTime, int OffSet, int FetchNext);
    public record ABTestingReport_ExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
