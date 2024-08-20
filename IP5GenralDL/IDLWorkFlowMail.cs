using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public interface IDLWorkFlowMail : IDisposable
    {
        Task<bool> Delete(int ConfigureMailId);
        Task<WorkFlowMail?> GetDetails(int ConfigureMailId, DateTime? FromDate = null, DateTime? ToDate = null, byte IsSplitTested = 0, string EmailId = null);
        Task<WorkFlowMail?> GetIsStopped(int ConfigureMailId);
        Task<WorkFlowMail?> GetMailDetails(int ConfigureMailId);
        Task<DataSet> GetOverAllCountByUserId(int WorkFlowId, int ContactId, int ConfigureMailId, DateTime? FromDate, DateTime? ToDate);
        Task<List<WorkFlowMail>> GetRecentWorkflowMailCampaignsForDailyOnce(int WorkFlowDaysLimit = 0);
        Task<List<WorkFlowMail>> GetRecentWorkflowMailCampaignsForInterval();
        Task<int> Save(WorkFlowMail workFlowMail);
        Task<bool> Update(WorkFlowMail workFlowMail);
        Task UpdateWorkflowMailCampaignSendStatus(int worflowMailSendingSettingId);
    }
}