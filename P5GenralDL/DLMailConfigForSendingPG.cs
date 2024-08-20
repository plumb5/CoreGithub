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
    public class DLMailConfigForSendingPG : CommonDataBaseInteraction, IDLMailConfigForSending
    {
        CommonInfo connection;
        public DLMailConfigForSendingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailConfigForSendingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int16> Save(MailConfigForSending verifyfromEmailId)
        {
            string storeProcCommand = "select * from mail_configforsending_save(@FromEmailId,@ActiveStatus)";
            object? param = new { verifyfromEmailId.FromEmailId, verifyfromEmailId.ActiveStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param);

        }

        public async Task<List<MailConfigForSending>> GetFromEmailIdToBind()
        {
            string storeProcCommand = "select * from mail_configforsending_get()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfigForSending>(storeProcCommand, param)).ToList();

        }

        public async Task<int> MaxCount()
        {
            string storeProcCommand = "select * from Mail_ConfigForSending(@Action)";
            object? param = new { Action = "MaxCount" };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select * from mail_configforsending_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> MakeEmailIdActive(int Id)
        {
            string storeProcCommand = "select * from mail_configforsending_makeemailidactive(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<List<MailConfigForSending>> GetActiveEmails()
        {
            string storeProcCommand = "select * from mail_configforsending_getactiveemailids()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfigForSending>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> ChangeEditableStatus(MailConfigForSending verifyfromEmailId)
        {
            string storeProcCommand = "select * from mail_configforsending_changeeditablestatus(@Id,@ShowFromEmailIdBasedOnUserLogin)";
            object? param = new { verifyfromEmailId.Id, verifyfromEmailId.ShowFromEmailIdBasedOnUserLogin };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<MailConfigForSending?> GetActiveFromEmailId()
        {
            string storeProcCommand = "select * from mail_configforsending_gettopactiveemailid()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailConfigForSending?>(storeProcCommand, param);

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
