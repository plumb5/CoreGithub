using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public interface IDLWorkFlowGroup : IDisposable
    {
        Task<List<Contact>> GetContactList(int GroupId, int OffSet, int FetchNext);
        Task<DataSet> GetGroupDetails(string GroupIds, int Offset, int FetchNext, bool Isbelong, int action);
        Task<List<WorkFlowGroup>> GetListDetails(WorkFlowGroup group, int OffSet, int FetchNext);
        Task<int> GetMaxCount(WorkFlowGroup groups);
        Task<int> GetTotalCount(string GroupIds);
        Task<List<MLWorkFlowContactGroup>> GetWorkFlowContactListDetails(int GroupId, int ContactType, int OffSet = -1, int FetchNext = -1);
        Task<int> MaxCount(string GroupIds, bool Isbelong);
    }
}