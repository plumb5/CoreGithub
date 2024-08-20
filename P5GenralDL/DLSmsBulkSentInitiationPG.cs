using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    internal class DLSmsBulkSentInitiationPG : CommonDataBaseInteraction, IDLSmsBulkSentInitiation
    {
        CommonInfo connection;

        public DLSmsBulkSentInitiationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentInitiationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<SmsBulkSentInitiation>>  GetSentInitiation()
        {
            string storeProcCommand = "select * from sms_bulksentinitiation_getsentinitiation()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SmsBulkSentInitiation>(storeProcCommand);
        }

        public async Task<bool> UpdateSentInitiation(SmsBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select sms_bulksentinitiation_updatesentinitiation(@SendingSettingId, @InitiationStatus )";
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.InitiationStatus };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<Int32> Save(SmsBulkSentInitiation BulkSentInitiation)
        {
            string storeProcCommand = "select sms_bulksentinitiation_save(@SendingSettingId,@IsPromotionalOrTransactionalType)";
            object? param = new { BulkSentInitiation.SendingSettingId, BulkSentInitiation.IsPromotionalOrTransactionalType };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<bool>  ResetSentInitiation()
        {
            string storeProcCommand = "select sms_bulksentinitiation_resetsentinitiation()";  
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand)>0;
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
