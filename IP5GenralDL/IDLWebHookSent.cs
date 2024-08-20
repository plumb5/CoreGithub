using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public interface IDLWebHookSent : IDisposable
    {
        Task<bool> DeleteResponsesFromWebHookBulk(DataTable WebHookSentBulk);
        Task<List<MLWebHookSentDetails>> GetWebHookSentDetails(int WebHookSendingSettingId, int Sucess, int OffSet, int FetchNext, DateTime? FromDate = null, DateTime? ToDate = null);
        Task<int> MaxCount(int WebHookSendingSettingId, int Sucess, DateTime? FromDateTime, DateTime? ToDateTime);
        Task<bool> SaveBulkWebHookResponses(DataTable WebHookSentBulk);
        Task<bool> UpdateTotalCounts(DataTable WebHookSentBulk, int ConfigureWebHookId);
    }
}