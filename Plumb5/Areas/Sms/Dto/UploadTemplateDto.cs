using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Sms.Dto
{
    public record UploadTemplate_SaveOrUpdateTemplateDto(SmsTemplate smsTemplateData, List<SmsTemplateUrl> smsTemplateUrlsData);
    public record UploadTemplate_SaveSmsTemplateUrlDto(SmsTemplateUrl smsTemplateUrlData);
    public record UploadTemplate_GetSmsTemplateUrlDto(int SmsTemplateId);
    public record UploadTemplate_DeleteDto(int SmsTemplateUrlId);
    public record UploadTemplate_CreateTemplateDto(SmsTemplate smsTemplate);
    public record UploadTemplate_DuplicateTemplateDto(SmsTemplate smsTemplateData);
    public record UploadTemplate_CheckDTLFileFormatDto(int AccountId);
    public record UploadTemplate_ImportFileDto(int AccountId);
    public record UploadTemplate_ImportFileForEditDto(int AccountId, int SmsTemplateId);
    public record UploadTemplate_CheckDLTRequiredDto(int adsId);
}
