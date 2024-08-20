using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.ManageContact.Dto
{
    public record PushSubscribers_GetMaxCountDto(int AccountId, WebPushUser webPushUser, int GroupId);
    public record PushSubscribers_GetDetailsDto(int AccountId, WebPushUser webPushUser, int Offset, int FetchNext, int GroupId);
    public record PushSubscribers_ExportWebPushSubscribersDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record PushSubscribers_GetGroupListDto(int accountId);
}
