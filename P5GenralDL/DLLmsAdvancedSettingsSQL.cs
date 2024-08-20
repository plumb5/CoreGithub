using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLLmsAdvancedSettingsSQL : CommonDataBaseInteraction, IDLLmsAdvancedSettings
    {
        CommonInfo connection;
        public DLLmsAdvancedSettingsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsAdvancedSettingsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> saveupdate(MLLmsAdvancedSettings MLLmsAdvancedSettings)
        {
            string storeProcCommand = "LMSAdvanceSetting";
            object? param = new { Action = "SaveUpdate", MLLmsAdvancedSettings.Key, MLLmsAdvancedSettings.Value };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLLmsAdvancedSettings>> GetDetailsAdvancedSettings(string key)
        {
            string storeProcCommand = "LMSAdvanceSetting";
            object? param = new { Action = "GetDetails", key };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLLmsAdvancedSettings>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
