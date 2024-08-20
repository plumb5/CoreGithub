using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLGroupMember : IDisposable
    {
        Task<int> Save(GroupMember groupMember, bool AssociateContactsToGrp = true);
        Task<int> BulkInsertionToGroupMember(int GroupId, DataTable dt);
        Task<bool> Delete(int GroupMemberId);
        Task<List<GroupMember>> GET(GroupMember groupMember, int FetchNext, int OffSetFetchIndex, string ListOfGroupId);
        Task<bool> RemoveContactFromOtherGroup(int GroupId);
        Task<int> DuplicateContactsToNewGroup(int GroupId, int NewGroupId);
        Task<bool> RemoveAll(int GroupId);
        Task<int> GetGroupsCount(int GroupId);
        Task<bool> DeleteByContactId(GroupMember groupMember);
        Task<Int64> GetTotalUniqueRecipientsCount(string ListOfGroupId);
        Task<bool> MergeDistinctContactIntoGroup(string ListOfGroupId, int GroupId, int UserInfoUserId);
        Task<bool> MergeDistinctContactIntoGroupByPhoneNumber(string ListOfGroupId, int GroupId, int UserInfoUserId);
        Task<long> GetUniquePhoneContact(string ListOfGroupId);
        Task<int> MoveGroupsContact(int UserId, string ListOfGroupId, int newGroupId);
        Task<bool> RemoveFromSelectedGroups(string ListOfGroupId);
        Task<bool> RemoveFromCampaigndGroupsForMail(int GroupId, int[] MailSendingSettingId, int[] CampaignResponseValue);
        Task<bool> RemoveFromCampaigndGroupsForSms(int GroupId, int[] SmsSendingSettingIdList, int[] CampaignResponseValue);
        Task<bool> RemoveFromCampaigndGroupsForWebPush(int GroupId, int[] WebPushSendingSettingIdList, int[] CampaignResponseValue);
        Task<bool> RemoveFromCampaigndGroupsForAppPush(int GroupId, int[] MobilePushSendingSettingIdList, int[] CampaignResponseValue);
        Task<bool> RemoveFromCampaigndGroupsForWhatsApp(int GroupId, int[] whatsappSendingSettingIdList, int[] CampaignResponseValue);
        Task<DataSet> GroupMemberCountsReport(int GroupId, int OffSet, int FetchNext);

        Task<int> GroupMemberMaxCount(int GroupId);
    }
}
