using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWorkFlowSMS : IDisposable
    {
        Task<int> Save(WorkFlowSMS workFlowSMS);
        Task<bool> Update(WorkFlowSMS workFlowSMS);
        Task<WorkFlowSMS?> GetDetails(int ConfigureSmsId, DateTime? FromDate = null, DateTime? ToDate = null, byte IsSplitTested = 0, string PhoneNumber = null);
        Task<WorkFlowSMS?> GetSmsDetails(int ConfigureSmsId);
        void UpdateWorkflowSmsCampaignSendStatus(int workflowSmsSendingSettingId);
        Task<List<WorkFlowSMS>> GetRecentWorkflowSmsCampaignsForInterval();
        Task<List<WorkFlowSMS>> GetRecentWorkflowSmsCampaignsForDailyOnce(int WorkFlowDaysLimit = 0);
    }
}
