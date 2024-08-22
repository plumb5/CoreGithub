using P5GenralML;

namespace Plumb5.Areas.CaptureForm.Dto
{
    public record CreateDto_SaveFormBannerHtmlDetails(int AccountId, FormDetails formdetails, FormRulesDto rulesData, FormBanner bannerDetails, FormResponseReportToSetting responseSettings, MailSendingSetting mailSettings, List<WebHookDetails> WebHookData, List<string> DeletedWebhookId = null, List<string> RuleChecking = null);
    public record CreateDto_GetFormDetails(int AccountId, int FormId);


}
