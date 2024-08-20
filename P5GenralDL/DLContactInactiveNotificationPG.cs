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
    public class DLContactInactiveNotificationPG : CommonDataBaseInteraction, IDLContactInactiveNotification
    {
        CommonInfo connection;

        public DLContactInactiveNotificationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactInactiveNotificationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(ContactInactiveNotification InactiveNotification)
        {
            string storeProcCommand = "select contact_inactivenotification_save(@IsSalesPersonNotification,@SalesPersonNotificationHours,@SalesPersonNotificationMail,@SalesPersonNotificationSms,@IsReportingPersonNotification,@ReportingPersonNotificationHours,@ReportingPersonNotificationMail,@ReportingPersonNotificationSms,@IsReportingPersonNotificationSenior,@IsReportingPersonNotificationGroup,@ReportingPersonNotificationGroupId,@SalesPersonNotificationWhatsapp,@ReportingPersonNotificationWhatsapp)";
            object? param = new
            {
                InactiveNotification.IsSalesPersonNotification,
                InactiveNotification.SalesPersonNotificationHours,
                InactiveNotification.SalesPersonNotificationMail,
                InactiveNotification.SalesPersonNotificationSms,
                InactiveNotification.IsReportingPersonNotification,
                InactiveNotification.ReportingPersonNotificationHours,
                InactiveNotification.ReportingPersonNotificationMail,
                InactiveNotification.ReportingPersonNotificationSms,
                InactiveNotification.IsReportingPersonNotificationSenior,
                InactiveNotification.IsReportingPersonNotificationGroup,
                InactiveNotification.ReportingPersonNotificationGroupId,
                InactiveNotification.SalesPersonNotificationWhatsapp,
                InactiveNotification.ReportingPersonNotificationWhatsapp
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<ContactInactiveNotification?> GetDetails()
        {
            string storeProcCommand = "select * from contact_inactivenotification_get()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactInactiveNotification?>(storeProcCommand);
        }

        public async Task<bool> UpdateSalesPersonNotificationDate()
        {
            string storeProcCommand = "select contact_inactivenotification_updatesalespersonnotificationdate()";

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand) > 0;
        }

        public async Task<bool> UpdateReportingPersonNotificationDate()
        {
            string storeProcCommand = "select contact_inactivenotification_updatenotificationdate()";

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand) > 0;
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
