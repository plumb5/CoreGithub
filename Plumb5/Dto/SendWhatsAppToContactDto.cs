using P5GenralML;

namespace Plumb5.Dto
{
    public record SendWhatsAppToContact_ScheduleOrSendWhatsAppDto(int accountId, Contact whatsappcontact, ContactMailSMSReminderDetailsDto ReminderDetails, int TemplateId, int SendType, string CampaignJobName, int lmsgroupmemberid = 0, int Score = 0, string Publisher = null, string LeadLabel = null, int WhatsAppConfigurationNameId = 0);
 
}
