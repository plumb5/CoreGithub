using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Sms.Dto
{
    public record SmsTemplateArchive_GetArchiveMaxCountDto(SmsTemplate smsTemplate);
    public record SmsTemplateArchive_GetArchiveTemplateListDto(SmsTemplate smsTemplate, int OffSet, int FetchNext);
    public record SmsTemplateArchive_ExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record SmsTemplateArchive_RestoreSmsTemplateDto(int AdsId, int Id);
}
