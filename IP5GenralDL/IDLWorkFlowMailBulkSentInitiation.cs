using P5GenralML;

namespace P5GenralDL
{
    public interface IDLWorkFlowMailBulkSentInitiation
    {
        Task<List<WorkFlowMailBulkSentInitiation>> GetSentInitiation();
        Task<bool> ResetSentInitiation();
        Task<int> Save(WorkFlowMailBulkSentInitiation BulkSentInitiation);
        Task<bool> UpdateSentInitiation(WorkFlowMailBulkSentInitiation BulkSentInitiation);
    }
}