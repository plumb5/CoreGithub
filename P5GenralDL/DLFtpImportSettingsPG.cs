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
    internal class DLFtpImportSettingsPG : CommonDataBaseInteraction, IDLFtpImportSettings
    {
        CommonInfo connection = null;
        public DLFtpImportSettingsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFtpImportSettingsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount()
        {
            string storeProcCommand = "select * from ftpimport_settings_maxcount()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<List<FtpImportSettings>> GetDetails(int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from ftpimport_settings_getdetails(@OffSet, @FetchNext)";
            object? param = new { OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FtpImportSettings>(storeProcCommand, param)).ToList();

        }
        public async Task<Int32> Save(FtpImportSettings ftpImportSettings)
        {
            string storeProcCommand = "select * from ftpimport_settings_save(@ConnectionName, @Protocol, @ServerIP, @Port, @UserName, @Password, @FolderPath )";
            object? param = new { ftpImportSettings.ConnectionName, ftpImportSettings.Protocol, ftpImportSettings.ServerIP, ftpImportSettings.Port, ftpImportSettings.UserName, ftpImportSettings.Password, ftpImportSettings.FolderPath };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<bool> Update(FtpImportSettings ftpImportSettings)
        {
            string storeProcCommand = "select * from ftpimport_settings_update(@Id, @ConnectionName, @Protocol, @ServerIP, @Port, @UserName, @Password, @FolderPath)";
            object? param = new { ftpImportSettings.Id, ftpImportSettings.ConnectionName, ftpImportSettings.Protocol, ftpImportSettings.ServerIP, ftpImportSettings.Port, ftpImportSettings.UserName, ftpImportSettings.Password, ftpImportSettings.FolderPath };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select * from ftpimport_settings_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
        public FtpImportSettings? GetFtpImportSettingsDetails(int Id)
        {
            string storeProcCommand = "select * from ftpimport_settings_get(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return db.QueryFirstOrDefault<FtpImportSettings>(storeProcCommand, param);

        }

        public async Task<List<FtpImportSettings>> GetDetailsList()
        {
            string storeProcCommand = "select * from ftpimport_settings_getdetailslist()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FtpImportSettings>(storeProcCommand, param)).ToList();

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
