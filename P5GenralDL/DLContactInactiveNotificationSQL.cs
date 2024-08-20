using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLContactInactiveNotificationSQL : CommonDataBaseInteraction, IDLContactInactiveNotification
    {
        CommonInfo connection;

        public DLContactInactiveNotificationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactInactiveNotificationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(ContactInactiveNotification InactiveNotification)
        {
            string storeProcCommand = "Contact_InactiveNotification";
            object? param = new
            {
                Action = "Save",
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
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<ContactInactiveNotification?> GetDetails()
        {
            string storeProcCommand = "Contact_InactiveNotification";
            object? param = new { Action = "GET" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactInactiveNotification?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateSalesPersonNotificationDate()
        {
            string storeProcCommand = "Contact_InactiveNotification";
            object? param = new { Action = "UpdateSalesPersonNotificationDate" };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateReportingPersonNotificationDate()
        {
            string storeProcCommand = "select Contact_InactiveNotification";
            object? param = new { Action = "UpdateReportingPersonNotificationDate" };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, commandType: CommandType.StoredProcedure) > 0;
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
