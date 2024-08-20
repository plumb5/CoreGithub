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
    public class DLMailDripForMailsPG : CommonDataBaseInteraction, IDLMailDripForMails
    {
        CommonInfo connection;
        public DLMailDripForMailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailDripForMailsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<MLMailDripForMails>> GetReport(int MailSendingSettingId)
        {
            string storeProcCommand = "select * from Mail_DripForMails(@Action,@MailSendingSettingId)";
            object? param = new { Action = "GetDripMails", MailSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailDripForMails>(storeProcCommand, param)).ToList();

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
