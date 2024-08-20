using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Dapper;
using static Dapper.SqlMapper;

namespace P5GenralDL
{
    internal class DLEmailVerifyProviderSettingSQL : CommonDataBaseInteraction, IDLEmailVerifyProviderSetting
    {
        CommonInfo connection;
        public DLEmailVerifyProviderSettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLEmailVerifyProviderSettingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(EmailVerifyProviderSetting setting)
        {
            string storeProcCommand = "Email_VerifyProviderSetting";
            object? param = new {Action= "Save", setting.UserInfoUserId, setting.ProviderName, setting.IsDefaultProvider, setting.IsActive, setting.ApiKey, setting.Password, setting.UserName, setting.APIUrl, setting.IsSaveCatchAll };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<bool> Update(EmailVerifyProviderSetting setting)
        {
            string storeProcCommand = "Email_VerifyProviderSetting";
            object? param = new { Action = "Update", setting.Id, setting.UserInfoUserId, setting.ProviderName, setting.IsDefaultProvider, setting.IsActive, setting.ApiKey, setting.Password, setting.UserName, setting.APIUrl, setting.IsSaveCatchAll };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;

        }
        public async Task<List<EmailVerifyProviderSetting>> GetList(string ProviderName = null)
        {
            string storeProcCommand = "Email_VerifyProviderSetting";
            object? param = new { Action= "Get", ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<EmailVerifyProviderSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<EmailVerifyProviderSetting?> GetActiveprovider()
        {
            string storeProcCommand = "Email_VerifyProviderSetting";
            object? param = new { Action = "GetActiveprovider"};

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<EmailVerifyProviderSetting?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Email_VerifyProviderSetting";
            object? param = new { Action = "Delete", Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

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

