using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSmsClickUrlPG : CommonDataBaseInteraction, IDLSmsClickUrl
    {
        CommonInfo connection;

        public DLSmsClickUrlPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsClickUrlPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount(MLSmsClickUrl sendingSettingId)
        {
            string storeProcCommand = "select * from sms_clickurlcontent_clickurlmaxcount(@SmsSendingSettingId)";
            object? param = new { sendingSettingId.SmsSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<MLSmsClickUrl>> GetResponseData(MLSmsClickUrl sendingSettingId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from sms_clickurlcontent_clickurldata(@SmsSendingSettingId, @OffSet, @FetchNext)";
            object? param = new { sendingSettingId.SmsSendingSettingId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsClickUrl>(storeProcCommand, param)).ToList();

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