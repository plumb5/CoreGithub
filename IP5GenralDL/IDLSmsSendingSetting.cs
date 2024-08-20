using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsSendingSetting:IDisposable
    {
        Task<Int32> Save(SmsSendingSetting smsSendingSetting);
        Task<SmsSendingSetting?> Get(int SmsSendingSettingId);
        Task<IEnumerable<SmsSendingSetting>> GetList(SmsSendingSetting smsSendingSetting);
        Task<IEnumerable<SmsSendingSetting>> GetListforapi(int SmsSendingSettingId);
        Task<Int32> SaveForForms(SmsSendingSetting smsSendingSetting);
        Task<bool> Update(SmsSendingSetting smsSendingSetting);
        Task<bool> Delete(int Id);
        Task<bool> UpdateSentCount(int SmsSendingSettingId, int TotalSentCount, int TotalNotSentCount);
        Task<bool> CheckIdentifier(string IdentifierName);
        Task<bool> UpdateScheduledCampaign(SmsSendingSetting smsSendingSetting);
        void UpdateSmsCampaignSendStatus(int SmsSendingSettingId);
        Task<IEnumerable<SmsSendingSetting>> GetRecentSmsCampaignsForInterval();
        Task<IEnumerable<SmsSendingSetting>> GetRecentSmsCampaignsForDailyOnce(int DaysLimit);
        Task<bool> UpdateStoppedErrorStatus(SmsSendingSetting smsSendingSetting);
    }
}
