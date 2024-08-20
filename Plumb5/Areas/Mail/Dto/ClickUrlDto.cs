using Microsoft.Identity.Client;
using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{
    public record ClickUrl_MaxCountDto(int accountId, MLMailClickUrl mailSendingSettingId, string fromDateTime, string toDateTime);
    public record ClickUrl_GetResponseDataDto(MLMailClickUrl mailSendingSettingId, int OffSet, int FetchNext);
    public record ClickUrl_ExportDto(int OffSet, int FetchNext, string FileType);
}
