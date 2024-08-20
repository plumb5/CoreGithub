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
    public class DLMailConfigForSendingSQL : CommonDataBaseInteraction, IDLMailConfigForSending
    {
        CommonInfo connection;
        public DLMailConfigForSendingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailConfigForSendingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int16> Save(MailConfigForSending verifyfromEmailId)
        {
            string storeProcCommand = "Mail_ConfigForSending";
            object? param = new { Action = "Save", verifyfromEmailId.FromEmailId, verifyfromEmailId.ActiveStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<MailConfigForSending>> GetFromEmailIdToBind()
        {
            string storeProcCommand = "Mail_ConfigForSending";
            object? param = new { Action = "GET" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfigForSending>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<int> MaxCount()
        {
            string storeProcCommand = "Mail_ConfigForSending";
            object? param = new { Action = "MaxCount" };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Mail_ConfigForSending";
            List<string> paramName = new List<string> { "@Action", "@Id" };
            object[] objDat = { "Delete", Id };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return DeleteDB(Command) > 0;
            }
        }

        public async Task<bool> MakeEmailIdActive(int Id)
        {
            string storeProcCommand = "Mail_ConfigForSending";
            object? param = new { Action = "MakeEmailIdActive", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }


        public async Task<List<MailConfigForSending>> GetActiveEmails()
        {
            string storeProcCommand = "Mail_ConfigForSending";
            object? param = new { Action = "GetActiveEmailIds" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailConfigForSending>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<bool> ChangeEditableStatus(MailConfigForSending verifyfromEmailId)
        {
            string storeProcCommand = "Mail_ConfigForSending";
            object? param = new { Action = "ChangeEditableStatus", verifyfromEmailId.Id, verifyfromEmailId.ShowFromEmailIdBasedOnUserLogin };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<MailConfigForSending?> GetActiveFromEmailId()
        {
            string storeProcCommand = "Mail_ConfigForSending";
            object? param = new { Action = "GetTopActiveEmailId" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailConfigForSending?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
