using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{
    public record TemplateDesign_GetMailCampaignListDto(int accountId);
    public record TemplateDesign_SaveStaticTemplateDto(int accountId, MailTemplate mailTemplate, int GalleryTemplateId); 
    public record TemplateDesign_SaveUploadedTemplateDto(int accountId, MailTemplate mailTemplate);
    public record TemplateDesign_UpdateEditContentDto(int accountId, int TemplateId, string HtmlContent); 
}
