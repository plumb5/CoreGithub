using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{
    public record MailSchedule_SaveScheduleDetails(int accountId, MailSendingSettingDto[] mailSendingSettingList);
    public record MailSchedule_GetMailScheduleDetails(int accountId, int MailSendingSettingId);
    public record MailSchedule_ShowSegmentAnalysis(int accountId, string GroupIds);
    public record MailSchedule_GetActiveEmailIds(int accountId);
    public record MailSchedule_CheckCredits(int accountId, int TotalContacts);
}
