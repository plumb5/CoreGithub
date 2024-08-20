using P5GenralML;

namespace P5GenralDL
{
    public interface IDLSmsBulkSentTimeSplitSchedule : IDisposable
    {
        Task<bool> DeleteById(int Id);
        Task<int> GetBulkSentCount(DateTime? FromDateTime, DateTime? ToDateTime);
        Task<List<MLSmsBulkSentTimeSplitScheduleReport>> GetBulkSentList(DateTime? FromDateTime, DateTime? ToDateTime, int OffSet, int FetchNext);
        Task<List<SmsBulkSentTimeSplitSchedule>> GetSmsBulkSentTimeSplitScheduleDetails(SmsBulkSentTimeSplitSchedule SmsBulkSentTimeSplitSchedule);
        Task<int> Save(SmsBulkSentTimeSplitSchedule SmsBulkSentTimeSplitSchedule);
        Task<bool> UpdateScheduledDate(SmsBulkSentTimeSplitSchedule SmsBulkSentTimeSplitSchedule);
    }
}