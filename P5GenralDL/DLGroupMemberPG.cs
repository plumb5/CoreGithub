using Dapper;
using DBInteraction;
using IP5GenralDL;
using NpgsqlTypes;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLGroupMemberPG : CommonDataBaseInteraction, IDLGroupMember
    {
        CommonInfo connection;

        public DLGroupMemberPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGroupMemberPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(GroupMember groupMember, bool AssociateContactsToGrp = true)
        {
            string storeProcCommand = "select * from group_member_save(@UserInfoUserId, @UserGroupId, @GroupId, @ContactId, @MachineId, @AssociateContactsToGrp)";
            object? param = new { groupMember.UserInfoUserId, groupMember.UserGroupId, groupMember.GroupId, groupMember.ContactId, groupMember.MachineId, AssociateContactsToGrp };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<int> BulkInsertionToGroupMember(int GroupId, DataTable dt)
        {
            string storeProcCommand = "select * from group_member_bulkcontactinsertiontogroupmember(@GroupId,@jsonData)";
            var jsonData = ConvertDataTableToJson(dt);

            var param = new DynamicParameters();
            param.Add("@GroupId", GroupId);
            param.Add("@jsonData", jsonData, DbType.String);

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> Delete(int GroupMemberId)
        {
            string storeProcCommand = "select * from group_member_delete(@GroupMemberId)";
            object? param = new { GroupMemberId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<List<GroupMember>> GET(GroupMember groupMember, int FetchNext, int OffSetFetchIndex, string ListOfGroupId)
        {
            string storeProcCommand = "select * from group_member_get(@UserInfoUserId, @GroupId, @ContactId, @MachineId, @FetchNext, @OffSetFetchIndex, @ListOfGroupId)";
            object? param = new { groupMember.UserInfoUserId, groupMember.GroupId, groupMember.ContactId, groupMember.MachineId, FetchNext, OffSetFetchIndex, ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GroupMember>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> RemoveContactFromOtherGroup(int GroupId)
        {
            string storeProcCommand = "select * from group_member_removecontactotherthanselectedgroup(@GroupId)";
            object? param = new { GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
        public async Task<int> DuplicateContactsToNewGroup(int GroupId, int NewGroupId)
        {
            string storeProcCommand = "select * from group_member_duplicatecontactstonewgroup(@GroupId, @NewGroupId)";
            object? param = new { GroupId, NewGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> RemoveAll(int GroupId)
        {
            string storeProcCommand = "select * from group_member_removeall(@GroupId)";
            object? param = new { GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<int> GetGroupsCount(int GroupId)
        {
            string storeProcCommand = "select * from group_member_getgroupscount(@GroupId)";
            object? param = new { GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }


        public async Task<bool> DeleteByContactId(GroupMember groupMember)
        {
            string storeProcCommand = "select * from group_member_deletebygroupidcontactid(@GroupId,@ContactId)";
            object? param = new { groupMember.GroupId, groupMember.ContactId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<Int64> GetTotalUniqueRecipientsCount(string ListOfGroupId)
        {
            string storeProcCommand = "select * from group_member_gettotaluniquerecipientscount(@ListOfGroupId)";
            object? param = new { ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int64>(storeProcCommand, param);
        }
        public async Task<bool> MergeDistinctContactIntoGroup(string ListOfGroupId, int GroupId, int UserInfoUserId)
        {
            string storeProcCommand = "select * from group_member_mergedistinctcontactintogroup(@ListOfGroupId,@GroupId,@UserInfoUserId)";
            object? param = new { ListOfGroupId, GroupId, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> MergeDistinctContactIntoGroupByPhoneNumber(string ListOfGroupId, int GroupId, int UserInfoUserId)
        {
            string storeProcCommand = "select * from group_member_mergedistinctcontactintogroupbyphonenumber(@ListOfGroupId,@GroupId,@UserInfoUserId)";
            object? param = new { ListOfGroupId, GroupId, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<long> GetUniquePhoneContact(string ListOfGroupId)
        {
            string storeProcCommand = "select * from group_member_getuniquephonecontact(@ListOfGroupId)";
            object? param = new { ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);
        }
        public async Task<int> MoveGroupsContact(int UserId, string ListOfGroupId, int newGroupId)
        {
            string storeProcCommand = "select * from group_member_movegroupscontact(@UserId,@NewGroupId,@ListOfGroupId)";
            object? param = new { UserId, newGroupId, ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<bool> RemoveFromSelectedGroups(string ListOfGroupId)
        {
            string storeProcCommand = "select * from group_member_removefromselectedgroups(@ListOfGroupId)";
            object? param = new { ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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

                string storeProcCommand = "select * from removefrom_group_removefrommailgroup(@GroupId, @Id, @Opened, @Clicked, @Forward, @Unsubscribe, @IsBounced, @SendStatus)";
                object? param = new { GroupId, Id, Opened, Clicked, Forward, Unsubscribe, IsBounced, SendStatus };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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

                string storeProcCommand = "select * from removefrom_group_removefromsmsgroup(@GroupId, @Id, @IsDelivered, @IsClicked, @NotDeliverStatus, @SendStatus)";
                object? param = new { GroupId, Id, IsDelivered, IsClicked, NotDeliverStatus, SendStatus };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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

                string storeProcCommand = "select * from removefrom_group_removefromwebpushgroup(@GroupId, @Id, @IsViewed, @IsClicked, @IsClosed, @SendStatus)";
                object? param = new { GroupId, Id, IsViewed, IsClicked, IsClosed, SendStatus };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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

                string storeProcCommand = "select * from removefrom_group_removefrommobilepushgroup(@GroupId, @Id, @IsViewed, @IsClicked, @IsClosed, @SendStatus)";
                object? param = new { GroupId, Id, IsViewed, IsClicked, IsClosed, SendStatus };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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

                string storeProcCommand = "select * from removefrom_group_removefromwhatsappgroup(@GroupId, @Id, @IsDelivered, @IsClicked, @NotDeliverStatus, @SendStatus)";
                object? param = new { GroupId, Id, IsDelivered, IsClicked, NotDeliverStatus, SendStatus };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
            }

            return Result;
        }
        public async Task<int> GroupMemberMaxCount(int GroupId)
        {
            string storeProcCommand = "select * from group_member_groupmemberscount(@GroupId)";
            object? param = new { GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<DataSet> GroupMemberCountsReport(int GroupId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from group_member_groupmembersreport(@GroupId, @OffSet, @FetchNext)";
            object? param = new { GroupId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
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
