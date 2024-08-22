using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Sms.Dto
{
    public record Template_GetMaxCountDto(SmsTemplate smsTemplateData);
    public record Template_GetTemplateListDto(SmsTemplate smsTemplateData, int OffSet, int FetchNext);
    public record Template_GetTemplateDto(int accountId, string TemplateName);
    public record Template_UpdateTemplateStatusDto(int accountId, int TemplateId);
    public record Template_GetTemplateDetailsDto(SmsTemplate smsTemplate);
    public record Template_GetAllTemplateDto(SmsTemplate smsTemplate);
    public record Template_DeleteDto(int Id);
    public record Template_ExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Template_CheckCounselorTagsDto(SmsTemplate smsTemplate);
}
