using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Sms.Dto
{
    public record ClickUrl_MaxCountDto(int accountId, MLSmsClickUrl smsSendingSettingId);
    public record ClickUrl_GetResponseDataDto(int accountId, MLSmsClickUrl smsSendingSettingId, int OffSet, int FetchNext);
}
