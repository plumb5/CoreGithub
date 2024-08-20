using P5GenralML;

namespace Plumb5.Areas.WhatsApp.Dto
{
    public record WhatsAppCampaign_MaxCountDto(WhatsAppCampaign WhatsAppCampaign);
    public record WhatsAppCampaign_SaveOrUpdateDetailsDto(WhatsAppCampaign WhatsAppCampaign);
    public record WhatsAppCampaign_DeleteDto(int Id);
    public record WhatsAppCampaign_ExportCampaignIdentifierDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
 

}
