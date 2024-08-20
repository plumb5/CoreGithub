using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLContactMailSMSReminderDetails : IDisposable
    {
        Task<int> GetScheduledMailAlertMaxCount(string FromDateTime, string ToDateTime, string UserIdList);
        Task<List<ContactMailSMSReminderDetails>> GetScheduledMailAlertDetails(string FromDateTime, string ToDateTime, string UserIdList, int OffSet, int FetchNext);
        Task<List<ContactMailSMSReminderDetails>> GetMailTemplateContent(string MailTemplateName, int Id);
        Task<bool> DeleteScheduledMailAlerts(Int16 Id);
        Task<int> GetScheduledSmsAlertMaxCount(string FromDateTime, string ToDateTime, string UserIdList);
        Task<List<ContactMailSMSReminderDetails>> GetScheduledSmsAlertDetails(string FromDateTime, string ToDateTime, string UserIdList, int OffSet, int FetchNext);
        Task<bool> DeleteScheduledSmsAlerts(Int16 Id);
        Task<int> GetScheduledWhatsappAlertMaxCount(string FromDateTime, string ToDateTime, string UserIdList);
        Task<List<ContactMailSMSReminderDetails>> GetScheduledWhatsappAlertDetails(string FromDateTime, string ToDateTime, string UserIdList, int OffSet, int FetchNext);
        Task<bool> DeleteScheduledWhatsappAlerts(Int16 Id);
        Task<int> SaveScheduledAlerts(ContactMailSMSReminderDetails reminderDetails);        
        Task<bool> UpdateScheduledMailAlerts(ContactMailSMSReminderDetails reminderDetails);
        Task<bool> UpdateScheduledSmsAlerts(ContactMailSMSReminderDetails reminderDetails);
        Task<bool> UpdateScheduledWhatsappAlerts(ContactMailSMSReminderDetails reminderDetails);
    }
}
