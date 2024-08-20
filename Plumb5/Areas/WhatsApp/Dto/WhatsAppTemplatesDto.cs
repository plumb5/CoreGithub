using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.WhatsApp.Dto
{
    public record WhatsAppTemplates_GetCampaignListDto(int accountId);
    public record WhatsAppTemplates_GetMaxCountDto(int AccountId, WhatsAppTemplates whatsAppTemplate);
    public record WhatsAppTemplates_SaveTemplateDto(int AccountId, WhatsAppTemplates whatsAppTemplate);
    public record WhatsAppTemplates_GetTemplateUrlListDto(int AccountId, int WhatsAppTemplatesId);
    public record WhatsAppTemplates_UpdateTemplateDto(int AccountId, WhatsAppTemplates whatsAppTemplate);
    public record WhatsAppTemplates_GetReportDto(int AccountId, WhatsAppTemplates whatsAppTemplate, int OffSet, int FetchNext);
    public record WhatsAppTemplates_GetSingleDto(int AccountId, int Id);
    public record WhatsAppTemplates_GetUserAttributesDto(int accountId);
    public record WhatsAppTemplates_ExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record WhatsAppTemplates_GetGroupListDto(int accountId, Groups group);
    public record WhatsAppTemplates_DeleteDto(int AdsId, int Id);
    public record WhatsAppTemplates_SendIndividualTestWhatsAappDto(int accountId, int WhatsAppTemplateId, string PhoneNumber, int WhatsAppConfigurationNameId);
    public record WhatsAppTemplates_SendGroupTestWhatsAappDto(int accountId, WhatsAppSendingSetting whatsappSendingSetting);
    public record WhatsAppTemplates_CheckCounselorTagsDto(WhatsAppTemplates whatsappTemplate);
    public record WhatsAppTemplates_GetTemplateDto(int accountId, string TemplateName);
    public record WhatsAppTemplates_UpdateTemplateStatusDto(int accountId, int TemplateId);
}
