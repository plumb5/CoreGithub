using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.WebPush.Dto
{
    public record Subscribers_GetMaxCountDto(int AccountId, WebPushUser webPushUser, string fromDateTime, string toDateTime, string FilterByEmailorPhone);
    public record Subscribers_GetDetailsDto(int AccountId, WebPushUser webPushUser, string fromDateTime, string toDateTime, int Offset, int FetchNext, string FilterByEmailorPhone);
    public record Subscribers_GetGroupNameByMachineIdDto(string[] deviceIds);
    public record Subscribers_AddToGroupDto(int accountId, string[] MachineIds, int[] Groups);
    public record Subscribers_DeleteFromGroupDto(int accountId, string[] MachineIds, int[] Groups);
    public record Subscribers_ExportWebPushSubscribersDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
}
