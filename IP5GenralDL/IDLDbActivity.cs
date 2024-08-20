using System.Data;

namespace P5GenralDL
{
    public interface IDLDbActivity:IDisposable
    {
        Task<bool> DbActivityDeleteRecords(int Pid);
        Task<int> DbActivitymaxCount(string TimeInterval);
        Task<DataSet> DbActivityReport(int OffSet, int FetchNext, string TimeInterval, string query = null);
        Task<DataSet> GetDBActivityTriggerMail(string TimeInterval);
    }
}