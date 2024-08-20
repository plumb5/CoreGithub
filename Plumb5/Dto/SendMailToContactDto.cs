using P5GenralML;

namespace Plumb5.Dto
{
    public record SendMailToContact_GetContactDetailsDto(int accountId, int ContactId);
    public record SendMailToContact_ScheduleOrSendMailDto(int accountId, Contact MailContact, ContactMailSMSReminderDetailsDto ReminderDetails, int TemplateId, int SendType, int lmsgroupmemberid = 0, int Score = 0, string Publisher = null, string LeadLabel = null);
    

}
