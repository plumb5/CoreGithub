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
    public class DLFacebookAssignmentSettingsPG : CommonDataBaseInteraction, IDLFacebookAssignmentSettings
    {
        CommonInfo connection = null;
        public DLFacebookAssignmentSettingsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFacebookAssignmentSettingsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> SaveSettings(FacebookAssignmentSettings AssignmentSettings)
        {
            string storeProcCommand = "select facebook_assignmentsettings_save(@PageId, @PageName, @IsAssignIndividualOrRoundRobin, @UserId, @UserGroupId, @GroupId, @LmsGroupId)";
            object param = new { AssignmentSettings.PageId, AssignmentSettings.PageName, AssignmentSettings.IsAssignIndividualOrRoundRobin, AssignmentSettings.UserId, AssignmentSettings.UserGroupId, AssignmentSettings.GroupId, AssignmentSettings.LmsGroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }
        public async Task<FacebookAssignmentSettings?> GetSettings(FacebookAssignmentSettings AssignmentSettings)
        {
            string storeProcCommand = "select * from facebook_assignmentsettings_get(@PageId)";
            object param = new { AssignmentSettings.PageId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<FacebookAssignmentSettings?>(storeProcCommand, param);
        }

        public async Task<bool> UpdateLastAssignedUserId(string PageId, int UserInfoUserId)
        {
            string storeProcCommand = "select * from facebook_assignmentsettings_updatelastassigneduserid(@PageId,@UserInfoUserId)";
            object param = new { PageId, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
