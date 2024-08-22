using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{
    public record DesignTemplateWithP5Editor_GetJsonContentDto(int accountId, int TemplateId);
    public record DesignTemplateWithP5Editor_GetContactCustomFieldDto(int accountId);
    public record DesignTemplateWithP5Editor_UpdateTemplateContentDto(int accountId, int TemplateId, string HtmlContent, string JsonContent);
    public record DesignTemplateWithP5Editor_GetTemplateImagesFilesDto(int accountId);

}
