using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLGroups : IDisposable
    {
        Task<Int32> Save(Groups group);
        Task<bool> Update(Groups group);
        Task<List<Groups>> GetDetails(Groups group, int FetchNext = 0, int OffSet = -1, string ListOfGroupId = "");
        Task<Groups?> Get(Groups group);
        Task<List<Groups>> GetGroupList(Groups group);
        Task<int> MaxCount(Groups group);
        Task<bool> Delete(int Id);
        Task<List<MLMailGroupsStaticContacts>> GetAllActiveInactiveCustomerCount();
        Task<int> GetMaxCount(MLGroups group, int UserInfoUserId = 0);
        Task<List<MLGroups>> BindGroupsContact(MLGroups group, int FetchNext, int OffSet, int UserInfoUserId = 0);
        Task<List<MLGroups>> BindGroupsDetails(MLGroups group, int FetchNext, int OffSet, int UserInfoUserId = 0);
        Task<MLGroups?> GetGroupsDetails(int GroupId);
        Task<MLGroups?> GetContactInfoDetails();
        Task<List<MLGroupContacts>> BindGroupAllContacts(int GroupId);
        Task<List<Groups>> GetCustomisedGroupList(IEnumerable<int> ListOfId, List<string> fieldName);
        Task<Groups?> GetGroupsByName(Groups group);
        Task<List<MLGroups>> BindGroupsDetailsWithoutCount(MLGroups group, int FetchNext, int OffSet, int UserInfoUserId = 0);
        Task<MLGroups?> GetGroupsCountByGroupId(int GroupId);
        Task<List<Groups>> GetGroupIdsFromName(List<string> GroupNameList);
        Task<List<MLGroups>> GetGroupDetailsForExport(MLGroups group, int OffSet, int FetchNext);
        Task<List<MLGroups>> GetGroupsByStaticOrDynamic(Int16 GroupType);
        Task<int> CheckGroupNameExistance(ControlGroups controlGroups);
        Task<DataSet> GetGroupEmailVerfiedCount(Groups group);
    }
}
