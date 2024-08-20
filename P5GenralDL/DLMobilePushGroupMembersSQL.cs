using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLMobilePushGroupMembersSQL : CommonDataBaseInteraction, IDLMobilePushGroupMembers
    {
        CommonInfo connection;

        public DLMobilePushGroupMembersSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushGroupMembersSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }


        public async Task<Int64> AddToGroup(MobilePushGroupMembers mobilebPushGroupMembers)
        {
            const string storeProcCommand = "MobilePush_GroupMembers";
            object? param = new { Action = "AddToGroup", mobilebPushGroupMembers.GroupId, mobilebPushGroupMembers.DeviceId, mobilebPushGroupMembers.ContactId, mobilebPushGroupMembers.UserInfoUserId, mobilebPushGroupMembers.UserGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int64>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> RemoveFromGroup(string[] deviceids, int GroupId)
        {
            List<bool> TrueFalselist = new List<bool>();
            foreach (var device in deviceids)
            {
                string storeProcCommand = "MobilePush_GroupMembers";
                object? param = new { Action = "RemoveFromGroup", device, GroupId };


                using var db = GetDbConnection(connection.Connection);
                TrueFalselist.Add(await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0);
            }
            return TrueFalselist.Any(x => x == true);
        }


        public async Task<long> GetUniqueDeviceId(string ListOfGroupId)
        {
            string storeProcCommand = "MobilePush_GroupMembers";
            object? param = new { Action = "GetUniqueDeviceId", ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> MergeDistinctDeviceIdIntoGroup(string ListOfGroupId, int GroupId, int UserInfoUserId)
        {
            string storeProcCommand = "MobilePush_GroupMembers";
            object? param = new { Action = "MergeDistinctDeviceIdIntoGroup", ListOfGroupId, GroupId, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<MLMobileDeviceInfo>> GetGroupMobilePushInfoList(int GroupId)
        {
            string storeProcCommand = "MobilePush_GroupMembers";
            object? param = new { Action = "GetGroupMemberDetails", GroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMobileDeviceInfo>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<Groups>> BelongToWhichGroup(string DeviceId)
        {
            string storeProcCommand = "MobilePush_GroupMembers";
            object? param = new { Action = "BelongToWhichGroup", DeviceId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
