using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBInteraction;
using IP5GenralDL;
using Dapper;

namespace P5GenralDL
{
    public class DLMailClickPG : CommonDataBaseInteraction, IDLMailClick
    {
        CommonInfo connection;
        public DLMailClickPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailClickPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
       
        public async Task<Int32> Save(MailClick mailClick)
        {
            string storeProcCommand = "select * from mail_click_save(@MailSendingSettingId, @ContactId, @TrackIp, @UrlLink, @P5MailUniqueID)";
            object? param = new { mailClick.MailSendingSettingId, mailClick.ContactId, mailClick.TrackIp, mailClick.UrlLink, mailClick.P5MailUniqueID };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<List<MailClick>> GetMailClick(IEnumerable<string> p5MailUniqueID)
        {
            string p5MailUniqueIDss = "";
            foreach (var p5MailUniqueIDs in p5MailUniqueID)
            {
                p5MailUniqueIDss += "'" + p5MailUniqueIDs + "',";
            }
            p5MailUniqueIDss = p5MailUniqueIDss.Remove(p5MailUniqueIDss.Length - 1);


            string storeProcCommand = "select * from mail_click_getlist(@p5MailUniqueIDss)";
            object? param = new { p5MailUniqueIDss };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailClick>(storeProcCommand, param)).ToList();
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
