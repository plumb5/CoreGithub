using P5GenralML;

namespace Plumb5.Areas.WhatsApp.Dto
{
    public record WhatsaAppClickUrl_MaxCountDto(int accountId, MLWhatsAppClickUrl WhatsAppSendingSettingId);
    public record WhatsaAppClickUrl_GetResponseDataDto(int accountId, MLWhatsAppClickUrl WhatsAppSendingSettingId, int OffSet, int FetchNext);
}
