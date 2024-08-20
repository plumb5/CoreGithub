using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLMailSpamScoreVerifySettingPG : CommonDataBaseInteraction, IDLMailSpamScoreVerifySetting
    {
        CommonInfo connection = null;
        public DLMailSpamScoreVerifySettingPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailSpamScoreVerifySettingPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> Save(MailSpamScoreVerifySetting setting)
        {
            string storeProcCommand = "select mail_spamscoreverifysetting_save(@UserInfoUserId, @ProviderName, @IsDefaultProvider, @IsActive, @ApiKey, @Password, @UserName)";
            object? param = new { setting.UserInfoUserId, setting.ProviderName, setting.IsDefaultProvider, setting.IsActive, setting.ApiKey, setting.Password, setting.UserName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<bool> Update(MailSpamScoreVerifySetting setting)
        {
            string storeProcCommand = "select mail_spamscoreverifysetting_update(@Id, @UserInfoUserId, @ProviderName, @IsDefaultProvider, @IsActive, @ApiKey, @Password, @UserName )";
            object? param = new { setting.Id, setting.UserInfoUserId, setting.ProviderName, setting.IsDefaultProvider, setting.IsActive, setting.ApiKey, setting.Password, setting.UserName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<List<MailSpamScoreVerifySetting>> GetList(string ProviderName = null)
        {
            string storeProcCommand = "select *  from mail_spamscoreverifysetting_get(@ProviderName)";
            object? param = new { ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailSpamScoreVerifySetting>(storeProcCommand, param)).ToList();
        }
        public async Task<MailSpamScoreVerifySetting?> GetActiveprovider()
        {
            string storeProcCommand = "select *  from mail_spamscoreverifysetting_getactiveprovider()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSpamScoreVerifySetting?>(storeProcCommand);
        }
        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select mail_spamscoreverifysetting_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
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
