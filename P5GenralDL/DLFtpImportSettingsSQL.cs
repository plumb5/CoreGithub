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
    public class DLFtpImportSettingsSQL : CommonDataBaseInteraction, IDLFtpImportSettings
    {
        CommonInfo connection = null;
        public DLFtpImportSettingsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFtpImportSettingsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount()
        {
            string storeProcCommand = "FtpImport_Settings";
            object? param = new { Action = "MaxCount" };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<List<FtpImportSettings>> GetDetails(int FetchNext, int OffSet)
        {
            string storeProcCommand = "FtpImport_Settings";
            object? param = new { Action = "GetDetails", FetchNext, OffSet };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FtpImportSettings>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<Int32> Save(FtpImportSettings ftpImportSettings)
        {
            string storeProcCommand = "FtpImport_Settings";
            object? param = new { Action = "Save", ftpImportSettings.ConnectionName, ftpImportSettings.Protocol, ftpImportSettings.ServerIP, ftpImportSettings.Port, ftpImportSettings.UserName, ftpImportSettings.Password, ftpImportSettings.FolderPath };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<bool> Update(FtpImportSettings ftpImportSettings)
        {
            string storeProcCommand = "FtpImport_Settings";
            object? param = new { Action = "Update", ftpImportSettings.Id, ftpImportSettings.ConnectionName, ftpImportSettings.Protocol, ftpImportSettings.ServerIP, ftpImportSettings.Port, ftpImportSettings.UserName, ftpImportSettings.Password, ftpImportSettings.FolderPath };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "FtpImport_Settings";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public FtpImportSettings? GetFtpImportSettingsDetails(int Id)
        {
            string storeProcCommand = "FtpImport_Settings";
            object? param = new { Action = "Get", Id };

            using var db = GetDbConnection(connection.Connection);
            return db.QueryFirstOrDefault<FtpImportSettings>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<FtpImportSettings>> GetDetailsList()
        {
            string storeProcCommand = "FtpImport_Settings";
            object? param = new { Action = "GetDetailsList" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FtpImportSettings>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

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
