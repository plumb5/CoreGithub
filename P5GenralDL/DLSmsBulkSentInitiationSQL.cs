using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    internal class DLSmsBulkSentInitiationSQL : CommonDataBaseInteraction, IDLSmsBulkSentInitiation
    {
        CommonInfo connection;

        public DLSmsBulkSentInitiationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentInitiationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<SmsBulkSentInitiation>> GetSentInitiation()
        {
            string storeProcCommand = "Sms_BulkSentInitiation";
            object? param = new { Action= "GetSentInitiation" };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsBulkSentInitiation>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> UpdateSentInitiation(SmsBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "Sms_BulkSentInitiation";
            object? param = new { Action = "UpdateSentInitiation", BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus };
            using var db = GetDbConnection(connection.Connection); 
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<Int32> Save(SmsBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "Sms_BulkSentInitiation";
            object? param = new { Action = "Save", BulkSentInitiation.SendingSettingId, BulkSentInitiation.IsPromotionalOrTransactionalType };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> ResetSentInitiation()
        {
            string storeProcCommand = "Sms_BulkSentInitiation";
            object? param = new { Action = "ResetSentInitiation" };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
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

