using P5GenralML;

namespace Plumb5.Areas.WebPush.Dto
{
    public record CreateTemplateDto_GetAllFieldDetails(int accountId);
    public record CreateTemplateDto_SaveOrUpdateTemplate(int accountId, WebPushTemplate webpushTemplate);
    public record CreateTemplateDto_CreateTemplateNext(int accountId, WebPushTemplate webpushTemplate);
}
