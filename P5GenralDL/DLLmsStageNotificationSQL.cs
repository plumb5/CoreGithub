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
    public class DLLmsStageNotificationSQL : CommonDataBaseInteraction, IDLLmsStageNotification
    {
        CommonInfo connection;
        public DLLmsStageNotificationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsStageNotificationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(LmsStageNotification notification)
        {
            string storeProcCommand = "LmsStage_Notification";
            object? param = new { Action = "Save", notification.LmsStageId, notification.Mail, notification.Sms, notification.ReportToSeniorId, notification.UserGroupId, notification.EmailIds, notification.PhoneNos, notification.AssignUserInfoUserId, notification.AssignUserGroupId, notification.IsOpenFollowUp, notification.IsOpenNotes, notification.WhatsApp, notification.WhatsappPhoneNos };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateLastAssignedUserId(Int16 LMSStageId, int UserInfoUserId)
        {
            string storeProcCommand = "LmsStage_Notification";
            object? param = new { Action = "Updat", LMSStageId, UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<LmsStageNotification>> GET()
        {
            string storeProcCommand = "LmsStage_Notification";
            object? param = new { Action = "GET" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsStageNotification>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<LmsStageNotification?> GET(int StageScore)
        {
            string storeProcCommand = "LmsStage_Notification";
            object? param = new { Action = "GetDetailsByScore", StageScore };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<LmsStageNotification?>(storeProcCommand, param);

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
