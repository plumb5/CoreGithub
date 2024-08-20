using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLSmsNotificationTemplatePG : CommonDataBaseInteraction, IDLSmsNotificationTemplate
    {
        CommonInfo connection;

        public DLSmsNotificationTemplatePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsNotificationTemplatePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> Save(SmsNotificationTemplate notificationTemplate)
        {
            string storeProcCommand = "select * from smsnotification_template_save(@Identifier, @Name, @VendorTemplateId, @MessageContent)";
            object? param = new { notificationTemplate.Identifier, notificationTemplate.Name, notificationTemplate.VendorTemplateId, notificationTemplate.MessageContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<SmsNotificationTemplate?> GetByIdentifier(string Identifier)
        {
            string storeProcCommand = "select * from smsnotification_template_getbyidentifier(@Identifier)";
            object? param = new { Identifier };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsNotificationTemplate?>(storeProcCommand, param);
        }

        public async Task<SmsNotificationTemplate> GetById(int Id)
        {
            string storeProcCommand = "select * from smsnotification_template_getbyid(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<SmsNotificationTemplate?>(storeProcCommand, param);
        }

        public async Task<List<SmsNotificationTemplate>> Get(int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from smsnotification_template_get(@OffSet, @FetchNext)";
            object? param = new { OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsNotificationTemplate>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> Update(SmsNotificationTemplate notificationTemplate)
        {
            string storeProcCommand = "select * from smsnotification_template_update(@Id, @VendorTemplateId, @Name)";
            object? param = new { notificationTemplate.Id, notificationTemplate.VendorTemplateId, notificationTemplate.Name };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<int> GetMaxCount()
        {
            string storeProcCommand = "select * from smsnotification_template_maxcount()";

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand);
        }

        public async Task<bool> UpdateStatus(bool IsSmsNotificationEnabled)
        {
            string storeProcCommand = "select * from smsnotification_template_updatestatus(@IsSmsNotificationEnabled)";
            object? param = new { IsSmsNotificationEnabled };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
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
