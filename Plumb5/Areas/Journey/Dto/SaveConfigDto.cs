using P5GenralML;

namespace Plumb5.Areas.Journey.Dto
{
    public record SaveConfig_SaveMailConfigDto(int accountId, WorkFlowMail MailConfig);
    public record SaveConfig_SaveSmsConfigDto(int accountId, WorkFlowSMS SmsConfig);
    public record SaveConfig_GetRuleDetailsDto(int accountId);
    public record SaveConfig_SaveWebPushConfigDto(int accountId, MLWorkFlowWebPush WebPushConfig);
    public record SaveConfig_SaveAppPushConfigDto(int accountId, MLWorkFlowMobile AppPushConfig);
    public record SaveConfig_UpdateDateDto(int accountId, int WorkflowId);
    public record SaveConfig_SaveWebHookConfigDetailsDto(int accountId, WorkFlowWebHook webhookConfig);
    public record SaveConfig_SaveWhatsappConfigDto(int accountId, MLWorkFlowWhatsApp WhatsappConfig);
}
