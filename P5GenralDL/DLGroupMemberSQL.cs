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
    public class DLGroupMemberSQL : CommonDataBaseInteraction, IDLGroupMember
    {
        CommonInfo connection;

        public DLGroupMemberSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGroupMemberSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(GroupMember groupMember, bool AssociateContactsToGrp = true)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "Save", groupMember.UserInfoUserId, groupMember.UserGroupId, groupMember.GroupId, groupMember.ContactId, groupMember.MachineId, AssociateContactsToGrp };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<int> BulkInsertionToGroupMember(int GroupId, DataTable dt)
        {
            string storeProcCommand = "Group_Member";
            var param = new DynamicParameters();
            param.Add("@Action", "BulkContactInsertiontoGroupMember");
            param.Add("@GroupId", GroupId);
            param.Add("@ControlGroupList", dt);

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(int GroupMemberId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "Delete", GroupMemberId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<GroupMember>> GET(GroupMember groupMember, int FetchNext, int OffSetFetchIndex, string ListOfGroupId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "GET", groupMember.UserInfoUserId, groupMember.GroupId, groupMember.ContactId, groupMember.MachineId, FetchNext, OffSetFetchIndex, ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GroupMember>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> RemoveContactFromOtherGroup(int GroupId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "RemoveContactOtherThanSelectedGroup", GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<int> DuplicateContactsToNewGroup(int GroupId, int NewGroupId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "DuplicateContactsToNewGroup", GroupId, NewGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> RemoveAll(int GroupId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "RemoveAll", GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> GetGroupsCount(int GroupId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "GetGroupsCount", GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }


        public async Task<bool> DeleteByContactId(GroupMember groupMember)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "DeleteByGroupIdContactId", groupMember.GroupId, groupMember.ContactId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<Int64> GetTotalUniqueRecipientsCount(string ListOfGroupId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "GetTotalUniqueRecipientsCount", ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int64>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<bool> MergeDistinctContactIntoGroup(string ListOfGroupId, int GroupId, int UserInfoUserId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "MergeDistinctContactIntoGroup", ListOfGroupId, GroupId, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> MergeDistinctContactIntoGroupByPhoneNumber(string ListOfGroupId, int GroupId, int UserInfoUserId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "MergeDistinctContactIntoGroupByPhoneNumber", ListOfGroupId, GroupId, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<long> GetUniquePhoneContact(string ListOfGroupId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "", ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<int> MoveGroupsContact(int UserId, string ListOfGroupId, int newGroupId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "GetUniquePhoneContact", UserId, newGroupId, ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<bool> RemoveFromSelectedGroups(string ListOfGroupId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "RemoveFromSelectedGroups", ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> RemoveFromCampaigndGroupsForMail(int GroupId, int[] MailSendingSettingId, int[] CampaignResponseValue)
        {
            short Opened, Clicked, Forward, Unsubscribe, IsBounced; Opened = Clicked = Forward = Unsubscribe = IsBounced = 0;
            byte? SendStatus = null;
            bool Result = false;

            foreach (int Id in MailSendingSettingId)
            {
                foreach (int value in CampaignResponseValue)
                {
                    if (value == 1)
                        Opened = 1;
                    else if (value == 2)
                        Clicked = 1;
                    else if (value == 3)
                        Unsubscribe = 1;
                    else if (value == 4)
                        IsBounced = 1;
                    else if (value == 5)
                        Forward = 1;
                    else if (value == 6)
                        SendStatus = 0;
                }

                string storeProcCommand = "RemoveFrom_Group";
                object? param = new { Action = "RemoveFromMailGroup", GroupId, Id, Opened, Clicked, Forward, Unsubscribe, IsBounced, SendStatus };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
            }

            return Result;
        }

        public async Task<bool> RemoveFromCampaigndGroupsForSms(int GroupId, int[] SmsSendingSettingIdList, int[] CampaignResponseValue)
        {
            bool Result = false;
            Int16 IsDelivered = 0;
            Int16 IsClicked = 0;
            Int16 NotDeliverStatus = 0;
            Int16? SendStatus = null;

            foreach (int Id in SmsSendingSettingIdList)
            {
                foreach (int value in CampaignResponseValue)
                {
                    if (value == 1)
                        IsDelivered = 1;
                    else if (value == 2)
                        IsClicked = 1;
                    else if (value == 3)
                        NotDeliverStatus = 1;
                    else if (value == 4)
                        SendStatus = 0;
                }

                string storeProcCommand = "RemoveFrom_Group";
                object? param = new { Action = "RemoveFromSmsGroup", GroupId, Id, IsDelivered, IsClicked, NotDeliverStatus, SendStatus };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
            }

            return Result;
        }

        public async Task<bool> RemoveFromCampaigndGroupsForWebPush(int GroupId, int[] WebPushSendingSettingIdList, int[] CampaignResponseValue)
        {
            bool Result = false;
            Int16 IsViewed = 0;
            Int16 IsClicked = 0;
            Int16 IsClosed = 0;
            Int16 SendStatus = 0;

            foreach (int Id in WebPushSendingSettingIdList)
            {
                foreach (int value in CampaignResponseValue)
                {
                    if (value == 1)
                        IsViewed = 1;
                    else if (value == 2)
                        IsClicked = 1;
                    else if (value == 3)
                        IsClosed = 1;
                    else if (value == 4)
                        SendStatus = 0;
                }

                string storeProcCommand = "RemoveFrom_Group";
                object? param = new { Action = "RemoveFromWebPushGroup", GroupId, Id, IsViewed, IsClicked, IsClosed, SendStatus };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
            }

            return Result;
        }

        public async Task<bool> RemoveFromCampaigndGroupsForAppPush(int GroupId, int[] MobilePushSendingSettingIdList, int[] CampaignResponseValue)
        {
            bool Result = false;
            Int16 IsViewed = 0;
            Int16 IsClicked = 0;
            Int16 IsClosed = 0;
            Int16 SendStatus = 0;

            foreach (int Id in MobilePushSendingSettingIdList)
            {
                foreach (int value in CampaignResponseValue)
                {
                    if (value == 1)
                        IsViewed = 1;
                    else if (value == 2)
                        IsClicked = 1;
                    else if (value == 3)
                        IsClosed = 1;
                    else if (value == 4)
                        SendStatus = 0;
                }

                string storeProcCommand = "RemoveFrom_Group";
                object? param = new { Action = "RemoveFromMobilePushGroup", GroupId, Id, IsViewed, IsClicked, IsClosed, SendStatus };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
            }

            return Result;
        }

        public async Task<bool> RemoveFromCampaigndGroupsForWhatsApp(int GroupId, int[] whatsappSendingSettingIdList, int[] CampaignResponseValue)
        {
            bool Result = false;
            Int16 IsDelivered = 0;
            Int16 IsClicked = 0;
            Int16 NotDeliverStatus = 0;
            Int16? SendStatus = null;

            foreach (int Id in whatsappSendingSettingIdList)
            {
                foreach (int value in CampaignResponseValue)
                {
                    if (value == 1)
                        IsDelivered = 1;
                    else if (value == 2)
                        IsClicked = 1;
                    else if (value == 3)
                        NotDeliverStatus = 1;
                    else if (value == 4)
                        SendStatus = 0;
                }

                string storeProcCommand = "RemoveFrom_Group";
                object? param = new { Action = "RemoveFromWhatsappGroup", GroupId, Id, IsDelivered, IsClicked, NotDeliverStatus, SendStatus };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
            }

            return Result;
        }
        public async Task<int> GroupMemberMaxCount(int GroupId)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "GroupMembersCount", GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<DataSet> GroupMemberCountsReport(int GroupId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Group_Member";
            object? param = new { Action = "GroupMembersReport", GroupId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;

        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
