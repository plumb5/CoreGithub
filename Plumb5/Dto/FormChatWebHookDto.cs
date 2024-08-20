using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Dto
{
    public record FormChatWebHook_MaxCountDto(int AdsId, int formOrChatId, string callingSource, string webhookids = null);
    public record FormChatWebHook_GetDetailsDto(int AdsId, int formOrChatId, string callingSource, int OffSet = 0, int FetchNext = 10, string webhookids = null);
}
