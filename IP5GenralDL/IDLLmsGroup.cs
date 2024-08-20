using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsGroup:IDisposable
    {
        Task<Int32> Save(LmsGroup lmsGroup);
        Task<bool> Update(LmsGroup lmsGroup);
        Task<bool> Delete(int lmsGroupId);
        Task<Int32> GetMaxCount(string UserIdList, LmsGroup lmsgroup);
        Task<IEnumerable<MLLmsGroup>> GetListLmsGroup(int OffSet, int FetchNext, string UserIdList, LmsGroup lmsgroup = null);
        Task<IEnumerable<LmsGroup>> GetCustomisedGroupList(IEnumerable<int> ListOfId, List<string> fieldName);
        Task<IEnumerable<LmsGroup>> GetLMSGroupList();
        Task<IEnumerable<LmsGroup>> GetLMSGroup(int LmsGroupMemberId);
    }
}
