using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLLmsGroupMembersSQL : CommonDataBaseInteraction, IDLLmsGroupMembers
    {
        CommonInfo connection;
        public DLLmsGroupMembersSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsGroupMembersSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(LmsGroupMembers groupMember, bool OverrideSources = false)
        {
            string storeProcCommand = "Contact_LMS_GroupMembers";

            object? param = new { Action = "AddToGroup", groupMember.LmsGroupId, groupMember.ContactId, OverrideSources };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateFollowUp(int LmsGroupmembersIds, int LmsGroupId, string FollowUpContent, Int16 FollowUpStatus, DateTime FollowUpdate, int FollowUpUserId)
        {
            string storeProcCommand = "Lms_Group";
            object? param = new { Action = "UpdateFollowups", LmsGroupmembersIds, LmsGroupId, FollowUpContent, FollowUpStatus, FollowUpdate, FollowUpUserId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<Int32> CheckAndSaveLmsGroup(int contactid, int userinfouserid, int lmsgroupid, int sourcetype, string lmscustomfields = null, int lmsgrpmemberid = 0, int score = 0, string label = null, string publisher = null)
        {
            string storeProcCommand = "contact_check_lms_groupmembers";
            object? param = new { Action = "Check_Lms", contactid, userinfouserid, lmsgroupid, sourcetype, lmscustomfields, lmsgrpmemberid, score, label, publisher };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Int32> CheckLmsSource(int contactid, int lmsgroupid, int sourcetype)
        {
            string storeProcCommand = "Contact_Details";
            object? param = new { Action = "SourceCheck", contactid, lmsgroupid, sourcetype };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<Int32> CheckLmsgrpUserId(int contactid, int lmsgroupid)
        {
            string storeProcCommand = "Lms_GroupMember";
            object? param = new { Action = "UserIdCheck", contactid, lmsgroupid };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<LmsGroupMembers?> GetLmsDetails(int lmsgroupmemberid = 0, int contactid = 0)
        {
            string storeProcCommand = "Lms_GroupMember";
            object? param = new { Action = "Get_Details", lmsgroupmemberid, contactid };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<LmsGroupMembers?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public List<LmsGroupMembers> GetLmsDetailsList(DataTable LmsCampaignContactId)
        {
            string storeProcCommand = "Lms_GroupMember";
            object? param = new { Action = "Get_Details_List", LmsCampaignContactId };

            using var db = GetDbConnection(connection.Connection);
            return db.Query<LmsGroupMembers>(storeProcCommand, param, commandType: CommandType.StoredProcedure).ToList();
        }

        public async Task<IEnumerable<MLLeadsDetails>> GetLmsGrpDetailsByContactId(int ContactId, int lmsgroupid)
        {
            string storeProcCommand = "Lms_GroupMember";
            object? param = new { Action = "Get", ContactId, lmsgroupid };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLLeadsDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<int>> LmsGrpGetUserInfoList(int ContactId)
        {
            List<int> FormIdList = new List<int>();
            string storeProcCommand = "Lms_Groupmember";
            object? param = new { Action = "GetUserDetails", ContactId };
            using var db = GetDbConnection(connection.Connection);
            var reader = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

            while (reader.Read())
            {
                FormIdList.Add(Convert.ToInt32(reader["FormId"]));
            }
            return FormIdList;
        }

        #region Dispose Method
        private bool _disposed = false;
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {
                    connection = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
