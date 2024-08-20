using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSmsBulkSentTimeSplitInitiation
    {
        Task<List<SmsBulkSentTimeSplitInitiation>> GetSentInitiation();
        Task<int> Save(SmsBulkSentTimeSplitInitiation BulkSentInitiation);
        Task<bool> UpdateSentInitiation(SmsBulkSentTimeSplitInitiation BulkSentInitiation);
    }
}