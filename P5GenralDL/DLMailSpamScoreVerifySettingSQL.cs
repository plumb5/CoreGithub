using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLMailSpamScoreVerifySettingSQL : CommonDataBaseInteraction, IDLMailSpamScoreVerifySetting
    {
        CommonInfo connection = null;
        public DLMailSpamScoreVerifySettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailSpamScoreVerifySettingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> Save(MailSpamScoreVerifySetting setting)
        {
            string storeProcCommand = "Mail_SpamScoreVerifySetting";
            object? param = new { @Action = "Save", setting.UserInfoUserId, setting.ProviderName, setting.IsDefaultProvider, setting.IsActive, setting.ApiKey, setting.Password, setting.UserName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<bool> Update(MailSpamScoreVerifySetting setting)
        {
            string storeProcCommand = "Mail_SpamScoreVerifySetting";
            object? param = new { @Action = "Update", setting.Id, setting.UserInfoUserId, setting.ProviderName, setting.IsDefaultProvider, setting.IsActive, setting.ApiKey, setting.Password, setting.UserName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<List<MailSpamScoreVerifySetting>> GetList(string ProviderName = null)
        {
            string storeProcCommand = "Mail_SpamScoreVerifySetting";
            object? param = new { @Action = "Get", ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MailSpamScoreVerifySetting>(storeProcCommand, param)).ToList();
        }
        public async Task<MailSpamScoreVerifySetting?> GetActiveprovider()
        {
            string storeProcCommand = "Mail_SpamScoreVerifySetting";
            object? param = new { @Action = "GetActiveprovider" };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MailSpamScoreVerifySetting?>(storeProcCommand);
        }
        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "Mail_SpamScoreVerifySetting";
            object? param = new { @Action = "Delete", Id };

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
