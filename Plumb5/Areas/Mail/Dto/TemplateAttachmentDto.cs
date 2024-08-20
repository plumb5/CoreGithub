namespace Plumb5.Areas.Mail.Dto
{
    public record TemplateAttachment_GetTemplateAttachmentDto(int accountId, int MailTemplateId);
    public record TemplateAttachment_DownLoadAttachmentDto(int accountId, int MailTemplateId, string AttachmentName);
    public record TemplateAttachment_DeleteTemplateDto(int accountId, int MailTemplateId, int AttachmentId, string AttachmentName);
    public record TemplateAttachment_SaveAttachmentDto(int accountId, int MailTemplateId); 

}
