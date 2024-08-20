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
    public class DLMobilePushGroupMembersPG : CommonDataBaseInteraction, IDLMobilePushGroupMembers
    {
        CommonInfo connection;

        public DLMobilePushGroupMembersPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushGroupMembersPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }


        public async Task<Int64> AddToGroup(MobilePushGroupMembers mobilebPushGroupMembers)
        {
            const string storeProcCommand = "select mobilepush_groupmembers_addtogroup(@GroupId, @DeviceId, @ContactId, @UserInfoUserId, @UserGroupId)";
            object? param = new { mobilebPushGroupMembers.GroupId, mobilebPushGroupMembers.DeviceId, mobilebPushGroupMembers.ContactId, mobilebPushGroupMembers.UserInfoUserId, mobilebPushGroupMembers.UserGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int64>(storeProcCommand, param);
        }

        public async Task<bool> RemoveFromGroup(string[] deviceids, int GroupId)
        {
            List<bool> TrueFalselist = new List<bool>();
            foreach (var device in deviceids)
            {
                string storeProcCommand = "select mobilepush_groupmembers_removefromgroup(@device, @GroupId)";
                object? param = new { device, GroupId };


                using var db = GetDbConnection(connection.Connection);
                TrueFalselist.Add(await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0);
            }
            return TrueFalselist.Any(x => x == true);
        }


        public async Task<long> GetUniqueDeviceId(string ListOfGroupId)
        {
            string storeProcCommand = "select mobilepush_groupmembers_getuniquedeviceid(@ListOfGroupId)";
            object? param = new { ListOfGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool> MergeDistinctDeviceIdIntoGroup(string ListOfGroupId, int GroupId, int UserInfoUserId)
        {
            string storeProcCommand = "select mobilepush_groupmembers_mergedistinctmachineidintogroup(@ListOfGroupId, @GroupId, @UserInfoUserId)";
            object? param = new { ListOfGroupId, GroupId, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<List<MLMobileDeviceInfo>> GetGroupMobilePushInfoList(int GroupId)
        {
            string storeProcCommand = "select * from mobilepush_groupmembers_getgroupmemberdetails(@GroupId)";
            object? param = new { GroupId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMobileDeviceInfo>(storeProcCommand, param)).ToList();
        }

        public async Task<List<Groups>> BelongToWhichGroup(string DeviceId)
        {
            string storeProcCommand = "select * from mobilepush_groupmembers_belongtowhichgroup(@DeviceId)";
            object? param = new { DeviceId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param)).ToList();
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
