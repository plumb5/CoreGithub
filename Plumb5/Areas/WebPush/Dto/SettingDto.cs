using Microsoft.AspNetCore.Mvc;
using Microsoft.Web.Administration;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.WebPush.Dto
{
    public record Setting_GetAccountDetailsDto(int accountId);
    public record Setting_GetSettingDetailsDto(int accountId);
    public record Setting_SaveWebPushSettingDto(int accountId, WebPushSubscriptionSetting subscriptionSetting, bool IsDomainPresent);
    public record Setting_DeleteDto(int accountId, int subscriptionSettingId);
    public record Setting_UploadSettingIconsDto(int accountId);
    
}
