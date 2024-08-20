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
    internal class DLWhatsAppConfigurationNameSQL : CommonDataBaseInteraction, IDLWhatsAppConfigurationName
    {
        CommonInfo connection;
        public DLWhatsAppConfigurationNameSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWhatsAppConfigurationNameSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<MLWhatsAppConfigurationName>> GetConfigurationNames()
        {
            string storeProcCommand = "WhatsApp_ConfigurationName";
            object? param = new { Action = "GetConfigurationName"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppConfigurationName>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<List<MLWhatsAppConfigurationName>> GetConfigurationNamesList()
        {
            string storeProcCommand = "WhatsApp_ConfigurationName";
            object? param = new { Action = "Get"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppConfigurationName>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
