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
    public class DLMailClickUrlSQL : CommonDataBaseInteraction, IDLMailClickUrl
    {
        CommonInfo connection;
        public DLMailClickUrlSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailClickUrlSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }


        public async Task<List<MLMailClickUrl>> GetResponseData(MLMailClickUrl mailSendingSettingId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Mail_ClickUrlContent";
            object? param = new { Action = "ClickUrlData", mailSendingSettingId.MailSendingSettingId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailClickUrl>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<int> MaxCount(MLMailClickUrl mailSendingSettingId)
        {
            string storeProcCommand = "Mail_ClickUrlContent";
            object? param = new { Action= "ClickUrlMaxCount", mailSendingSettingId.MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
