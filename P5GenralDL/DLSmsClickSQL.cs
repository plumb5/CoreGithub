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
    public class DLSmsClickSQL : CommonDataBaseInteraction, IDLSmsClick
    {
        CommonInfo connection;

        public DLSmsClickSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsClickSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(SmsClick mailClick)
        {
            string storeProcCommand = "Sms_Click";
            object? param = new { Action= "Save", mailClick.SmsSendingSettingId, mailClick.ContactId, mailClick.TrackIp, mailClick.UrlLink, mailClick.P5SMSUniqueID };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<SmsClick>> GetSmsClick(IEnumerable<string> p5SMSUniqueID)
        {
            string p5SMSUniqueIDss = "";
            string storeProcCommand = "Sms_Click";
            foreach (var p5SMSUniqueIDs in p5SMSUniqueID)
            {
                p5SMSUniqueIDss += "'" + p5SMSUniqueIDs + "',";
            }
            p5SMSUniqueIDss = p5SMSUniqueIDss.Remove(p5SMSUniqueIDss.Length - 1);            

            object? param = new { Action = "GETLIST", p5SMSUniqueIDss };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsClick>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
