using Microsoft.AspNetCore.Mvc;

namespace Plumb5.Areas.Mail.Dto
{
    public record DesignTemplateWithEditor_GetContactCustomFieldDto(int accountId);
    public record DesignTemplateWithEditor_GetJsonContentDto(int accountId, int TemplateId);
    public record DesignTemplateWithEditor_UpdateTemplateContentDto(int accountId, int TemplateId, string HtmlContent, string JsonContent);
}
