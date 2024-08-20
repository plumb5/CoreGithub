using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLLmsGroupMembers : IDisposable
    {
        Task<Int32> Save(LmsGroupMembers groupMember, bool OverrideSources = false);
        Task<bool> UpdateFollowUp(int LmsGroupmembersIds, int LmsGroupId, string FollowUpContent, Int16 FollowUpStatus, DateTime FollowUpdate, int FollowUpUserId);
        Task<Int32> CheckAndSaveLmsGroup(int contactid, int userinfouserid, int lmsgroupid, int sourcetype, string lmscustomfields = null, int lmsgrpmemberid = 0, int score = 0, string label = null, string publisher = null);
        Task<Int32> CheckLmsSource(int contactid, int lmsgroupid, int sourcetype);
        Task<Int32> CheckLmsgrpUserId(int contactid, int lmsgroupid);
        Task<LmsGroupMembers?> GetLmsDetails(int lmsgroupmemberid = 0, int contactid = 0);
        List<LmsGroupMembers> GetLmsDetailsList(DataTable LmsCampaignContactId);
        Task<IEnumerable<MLLeadsDetails>> GetLmsGrpDetailsByContactId(int ContactId, int lmsgroupid);
        Task<IEnumerable<int>> LmsGrpGetUserInfoList(int ContactId);
    }
}
