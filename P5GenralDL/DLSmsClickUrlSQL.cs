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
    public class DLSmsClickUrlSQL : CommonDataBaseInteraction, IDLSmsClickUrl
    {
        CommonInfo connection;

        public DLSmsClickUrlSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsClickUrlSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount(MLSmsClickUrl sendingSettingId)
        {
            string storeProcCommand = "Sms_ClickUrlContent";
            object? param = new { Action= "ClickUrlMaxCount", sendingSettingId.SmsSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<MLSmsClickUrl>> GetResponseData(MLSmsClickUrl sendingSettingId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Sms_ClickUrlContent";
            object? param = new { Action = "ClickUrlData", sendingSettingId.SmsSendingSettingId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsClickUrl>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
