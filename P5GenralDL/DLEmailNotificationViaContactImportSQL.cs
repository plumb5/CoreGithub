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
    public class DLEmailNotificationViaContactImportSQL : CommonDataBaseInteraction, IDLEmailNotificationViaContactImport
    {
        CommonInfo connection;
        public DLEmailNotificationViaContactImportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLEmailNotificationViaContactImportSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<EmailNotificationViaContactImport>> GetList(EmailNotificationViaContactImport emailNotificationViaContactImport)
        {
            string storeProcCommand = "EmailNotification_ViaContactImport";
            object? param = new { Action= "GetList", emailNotificationViaContactImport.Id, emailNotificationViaContactImport.NotificationEmailId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<EmailNotificationViaContactImport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
    }
}
