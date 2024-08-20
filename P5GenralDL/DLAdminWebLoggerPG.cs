using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;

namespace P5GenralDL
{
    public class DLAdminWebLoggerPG : CommonDataBaseInteraction, IDLAdminWebLogger
    {
        CommonInfo connection;
        public DLAdminWebLoggerPG()
        {
            connection = GetDBConnection();
        }

        public async Task<long> SaveLog(AdminWebLogger logDetails)
        {
            string storeProcCommand = "select adminweb_logger_save(@LogUniqueId,@RequestType,@AccountId,@UserInfoUserId,@UserName,@UserEmail,@ChannelName,@ControllerName,@ActionName,@IpAddress,@LogContent,@Headers,@RequestedMethod,@Useragent,@AbsoluteUri,@CallType,@StatusCode,@CreatedDate)";
            object? param = new { logDetails.LogUniqueId, logDetails.RequestType, logDetails.AccountId, logDetails.UserInfoUserId, logDetails.UserName, logDetails.UserEmail, logDetails.ChannelName, logDetails.ControllerName, logDetails.ActionName, logDetails.IpAddress, logDetails.LogContent, logDetails.Headers, logDetails.RequestedMethod, logDetails.Useragent, logDetails.AbsoluteUri, logDetails.CallType, logDetails.StatusCode, logDetails.CreatedDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);
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
