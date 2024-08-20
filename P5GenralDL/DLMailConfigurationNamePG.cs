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
    public class DLMailConfigurationNamePG : CommonDataBaseInteraction, IDLMailConfigurationName
    {
        CommonInfo connection;
        public DLMailConfigurationNamePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailConfigurationNamePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MLMailConfigurationName>> GetConfigurationNames()
        {
            string storeProcCommand = "select * from mail_configurationname_getconfigurationnames()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailConfigurationName>(storeProcCommand, param)).ToList();

        }

        public async Task<List<MLMailConfigurationName>> GetConfigurationNamesList()
        {
            string storeProcCommand = "select * from mail_configurationname_get()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailConfigurationName>(storeProcCommand, param)).ToList();
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
