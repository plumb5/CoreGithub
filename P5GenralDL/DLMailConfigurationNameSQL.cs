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
    public class DLMailConfigurationNameSQL : CommonDataBaseInteraction, IDLMailConfigurationName
    {
        CommonInfo connection;
        public DLMailConfigurationNameSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailConfigurationNameSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MLMailConfigurationName>> GetConfigurationNames()
        {
            string storeProcCommand = "Mail_ConfigurationName";
            object? param = new { Action = "GetConfigurationNames"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailConfigurationName>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<List<MLMailConfigurationName>> GetConfigurationNamesList()
        {
            string storeProcCommand = "Mail_ConfigurationName";
            object? param = new { Action = "Get"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailConfigurationName>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
