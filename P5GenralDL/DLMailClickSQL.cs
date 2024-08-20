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
    public class DLMailClickSQL : CommonDataBaseInteraction, IDLMailClick
    {
        CommonInfo connection;
        public DLMailClickSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailClickSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(MailClick mailClick)
        {
            string storeProcCommand = "Mail_Click";
            object? param = new { Action= "Save", mailClick.MailSendingSettingId, mailClick.ContactId, mailClick.TrackIp, mailClick.UrlLink, mailClick.P5MailUniqueID };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<MailClick>> GetMailClick(IEnumerable<string> p5MailUniqueID)
        {
            string p5MailUniqueIDss = "";
            string storeProcCommand = "Mail_Click";
            foreach (var p5MailUniqueIDs in p5MailUniqueID)
            {
                p5MailUniqueIDss += "'" + p5MailUniqueIDs + "',";
            }
            p5MailUniqueIDss = p5MailUniqueIDss.Remove(p5MailUniqueIDss.Length - 1);
            List<string> paramName = new List<string> { "@Action", "@p5MailUniqueID" };

            object[] objDat = { "GETLIST", p5MailUniqueIDss };
            List<string> fields = new List<string>() { "UrlLink", "P5MailUniqueID" };
            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return DataReaderMapToList<MailClick>(Command, fields);
            }
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
