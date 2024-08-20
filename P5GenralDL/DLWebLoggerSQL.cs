using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace P5GenralDL
{
    public class DLWebLoggerSQL : CommonDataBaseInteraction, IDLWebLogger
    {
        CommonInfo connection;
        public DLWebLoggerSQL()
        {
            connection = GetDBConnection();
        }

        public async Task<long> SaveLog(WebLogger logDetails)
        {
            string storeProcCommand = "Web_Logger";
            object? param = new { Action= "Save", logDetails.LogUniqueId, logDetails.RequestType, logDetails.AccountId, logDetails.UserInfoUserId, logDetails.UserName, logDetails.UserEmail, logDetails.ChannelName, logDetails.ControllerName, logDetails.ActionName, logDetails.IpAddress, logDetails.LogContent, logDetails.Headers, logDetails.RequestedMethod, logDetails.Useragent, logDetails.AbsoluteUri, logDetails.CallType, logDetails.StatusCode, logDetails.CreatedDate, logDetails.CustomMessage };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<int> GetMaxCount(WebLogger logDetails, DateTime FromDateTime, DateTime ToDateTime, string UserIdList)
        {
            string storeProcCommand = "Web_Logger";
            object? param = new { Action= "GetMaxCount", FromDateTime, ToDateTime, logDetails.AccountId, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<WebLogger>> GetLogData(WebLogger logDetails, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string UserIdList)
        {
            string storeProcCommand = "Web_Logger";
            object? param = new { Action = "GetList", FromDateTime, ToDateTime, OffSet, FetchNext, logDetails.AccountId, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebLogger>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<List<WebLogger>> GetLogsForNotification(WebLogger logDetails, string UserIdList)
        {
            string storeProcCommand = "Web_Logger";
            object? param = new { Action = "GetLogsForNotification", logDetails.AccountId, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebLogger>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<WebLogger> GetLogDetails(WebLogger logDetails)
        {
            string storeProcCommand = "Web_Logger";
            object? param = new { Action = "GetLogDetails", logDetails.AccountId, logDetails.LogId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebLogger>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
