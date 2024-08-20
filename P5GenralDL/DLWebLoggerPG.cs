using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWebLoggerPG : CommonDataBaseInteraction, IDLWebLogger
    {
        CommonInfo connection;
        public DLWebLoggerPG()
        {
            connection = GetDBConnection();
        }


        public async Task<long> SaveLog(WebLogger logDetails)
        {
            try
            {
                string storeProcCommand = "select * from web_logger_save(@LogUniqueId,@RequestType,@AccountId,@UserInfoUserId,@UserName,@UserEmail,@ChannelName,@ControllerName,@ActionName,@IpAddress,@LogContent,@Headers,@RequestedMethod,@Useragent,@AbsoluteUri,@CallType,@StatusCode,@CreatedDate,@CustomMessage)";
                object? param = new { logDetails.LogUniqueId, logDetails.RequestType, logDetails.AccountId, logDetails.UserInfoUserId, logDetails.UserName, logDetails.UserEmail, logDetails.ChannelName, logDetails.ControllerName, logDetails.ActionName, logDetails.IpAddress, logDetails.LogContent, logDetails.Headers, logDetails.RequestedMethod, logDetails.Useragent, logDetails.AbsoluteUri, logDetails.CallType, logDetails.StatusCode, logDetails.CreatedDate, logDetails.CustomMessage };

                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
            }
            catch (Exception ex)
            {
                return 00;
            }
        }

        public async Task<int> GetMaxCount(WebLogger logDetails, DateTime FromDateTime, DateTime ToDateTime, string UserIdList)
        {
            string storeProcCommand = "select * from web_logger_getmaxcount(@FromDateTime, @ToDateTime, @AccountId, @UserIdList)";
            object? param = new { FromDateTime, ToDateTime, logDetails.AccountId, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<WebLogger>> GetLogData(WebLogger logDetails, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string UserIdList)
        {
            string storeProcCommand = "select * from SelectVisitorAutoSuggest(@FromDateTime, @ToDateTime, @OffSet, @FetchNext, @AccountId, @UserIdList )";
            object? param = new { FromDateTime, ToDateTime, OffSet, FetchNext, logDetails.AccountId, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebLogger>(storeProcCommand, param)).ToList();

        }

        public async Task<List<WebLogger>> GetLogsForNotification(WebLogger logDetails, string UserIdList)
        {
            string storeProcCommand = "select * from web_logger_getlogsfornotification(@AccountId,@UserIdList)";
            object? param = new { logDetails.AccountId, UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebLogger>(storeProcCommand, param)).ToList();

        }

        public async Task<WebLogger?> GetLogDetails(WebLogger logDetails)
        {
            string storeProcCommand = "select * from web_logger_getlogdetails(@AccountId,@LogId)";
            object? param = new { logDetails.AccountId, logDetails.LogId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WebLogger>(storeProcCommand, param);

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
