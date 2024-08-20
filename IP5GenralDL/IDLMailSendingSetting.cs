using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailSendingSetting : IDisposable
    {
        Task<int> Save(MailSendingSetting mailSendingSetting);
        Task<bool> Update(MailSendingSetting mailSendingSetting);
        Task<MailSendingSetting?> GetDetail(int MailSendingSettingId);
        Task<int> SaveResponseMailSettingOfForms(MailSendingSetting mailSendingSetting);
        Task<int> UpdateStats(int MailSendingSettingId, int TotalSentcount, int TotalNotSentcount, bool? IsMailSplit, bool? IsMailSplitTest);
        Task<List<MailSendingSetting>> GetDetailsForEdit(int MailSendingSettingId);
        Task UpdateMailCampaignSendStatus(int MailSendingSettingId);
        Task<List<MailSendingSetting>> GetRecentMailCampaignsForInterval();
        Task<List<MailSendingSetting>> GetRecentMailCampaignsForDailyOnce(int DaysLimit);
        Task<bool> UpdateStoppedErrorStatus(MailSendingSetting mailSendingSetting);
    }
}
