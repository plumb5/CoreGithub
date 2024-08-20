using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.Journey.Dto
{
    public record Webhook_MaxCountDto(int accountId, int WebHookSendingSettingId, int Sucess, string fromDateTime, string toDateTime);
    public record Webhook_GetReportDetailsDto(int accountId, int WebHookSendingSettingId, int Sucess, int OffSet, int FetchNext, string fromDateTime, string toDateTime);
}
