using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLSmsNotificationTemplateSQL : CommonDataBaseInteraction, IDLSmsNotificationTemplate
    {
        CommonInfo connection;

        public DLSmsNotificationTemplateSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsNotificationTemplateSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> Save(SmsNotificationTemplate notificationTemplate)
        {
            string storeProcCommand = "SmsNotification_Template";
            object? param = new { @Action = "Save", notificationTemplate.Identifier, notificationTemplate.Name, notificationTemplate.VendorTemplateId, notificationTemplate.MessageContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<SmsNotificationTemplate?> GetByIdentifier(string Identifier)
        {
            string storeProcCommand = "SmsNotification_Template";
            object? param = new { @Action = "GetByIdentifier", Identifier };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsNotificationTemplate?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<SmsNotificationTemplate> GetById(int Id)
        {
            string storeProcCommand = "SmsNotification_Template";
            object? param = new { @Action = "GetById", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsNotificationTemplate?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<SmsNotificationTemplate>> Get(int OffSet, int FetchNext)
        {
            string storeProcCommand = "SmsNotification_Template";
            object? param = new { @Action = "Get", OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsNotificationTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<bool> Update(SmsNotificationTemplate notificationTemplate)
        {
            string storeProcCommand = "SmsNotification_Template";
            object? param = new { @Action = "Update", notificationTemplate.Id, notificationTemplate.VendorTemplateId, notificationTemplate.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> GetMaxCount()
        {
            string storeProcCommand = "SmsNotification_Template";
            object? param = new { @Action = "MaxCount" };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateStatus(bool IsSmsNotificationEnabled)
        {
            string storeProcCommand = "SmsNotification_Template";
            object? param = new { @Action = "UpdateStatus", IsSmsNotificationEnabled };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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

