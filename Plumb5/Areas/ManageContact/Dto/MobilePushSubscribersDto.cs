using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.ManageContact.Dto
{
    public record MobilePushSubscribers_GetMaxCount(int AccountId, MobileDeviceInfo mobPushUser, int GroupId);
    public record MobilePushSubscribers_GetDetails(int AccountId, MobileDeviceInfo mobPushUser, int Offset, int FetchNext, int GroupId);
    public record MobilePushSubscribers_ExportMobPushSubscribers(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record MobilePushSubscribers_GetGroupList(int accountId);


}
