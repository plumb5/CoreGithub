using P5GenralML;
namespace Plumb5.Dto
{
    public record SendSMSToContact_GetContactDetailsDto(int accountId, int ContactId);
    public record SendSMSToContact_ScheduleOrSendSmsDto(int accountId, Contact SmsContact, ContactMailSMSReminderDetailsDto ReminderDetails, int TemplateId, int SendType, string CampaignJobName, int lmsgroupmemberid = 0, int Score = 0, string Publisher = null, string LeadLabel = null);

}
