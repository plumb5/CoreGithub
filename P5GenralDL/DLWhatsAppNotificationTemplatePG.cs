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
    public class DLWhatsAppNotificationTemplatePG : CommonDataBaseInteraction, IDLWhatsAppNotificationTemplate
    {
        CommonInfo connection;
        public DLWhatsAppNotificationTemplatePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWhatsAppNotificationTemplatePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<WhatsAppNotificationTemplate?> GetByIdentifier(string Identifier)
        {
            string storeProcCommand = "select * from whatsappnotification_template_getbyidentifier(@Identifier)";
            object? param = new { Identifier };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppNotificationTemplate>(storeProcCommand, param);

        }
        public async Task<int> GetMaxCount()
        {
            string storeProcCommand = "select * from whatsappnotification_template_maxcount()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<List<WhatsAppNotificationTemplate>> Get(int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from whatsappnotification_template_get(@OffSet, @FetchNext)";
            object? param = new { OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WhatsAppNotificationTemplate>(storeProcCommand, param)).ToList();

        }

        public async Task<WhatsAppNotificationTemplate?> GetById(int Id)
        {
            string storeProcCommand = "select * from whatsappnotification_template_getbyid(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<WhatsAppNotificationTemplate>(storeProcCommand, param);

        }
        public async Task<bool> UpdateStatus(bool IsWhatsAppNotificationEnabled)
        {
            string storeProcCommand = "select * from whatsappnotification_template_updatestatus(@IsWhatsAppNotificationEnabled)";
            object? param = new { IsWhatsAppNotificationEnabled };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> Update(WhatsAppNotificationTemplate notificationTemplate)
        {
            string storeProcCommand = "select * from whatsappnotification_template_update(@Id, @WhiteListedTemplateName, @TemplateName)";
            object? param = new { notificationTemplate.Id, notificationTemplate.WhiteListedTemplateName, notificationTemplate.TemplateName };

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
