using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.Mail.Dto
{
    public record DesignUploadTemplateWithEditor_GetContactCustomFieldDto(int accountId);
    public record DesignUploadTemplateWithEditor_GetTemplateDetailsDto(int accountId, int TemplateId);
    public record DesignUploadTemplateWithEditor_UploadImageDto(int accountId, int mailTemplateId);
    public record DesignUploadTemplateWithEditor_DeleteImageDto(int accountId, int mailTemplateId, string imageName);
}
