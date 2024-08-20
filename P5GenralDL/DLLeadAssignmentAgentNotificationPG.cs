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
    public class DLLeadAssignmentAgentNotificationPG : CommonDataBaseInteraction, IDLLeadAssignmentAgentNotification
    {
        CommonInfo connection;
        public DLLeadAssignmentAgentNotificationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLeadAssignmentAgentNotificationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        //Lead Notification

        public async Task<Int32> SaveLeadAssignmentAgentNotification(LeadAssignmentAgentNotification lmsleadassigntouser)
        {
            string storeProcCommand = "select   leadassignment_agentnotification_save(@Mail,@Sms,@WhatsApp)";
            object? param = new { lmsleadassigntouser.Mail, lmsleadassigntouser.Sms, lmsleadassigntouser.WhatsApp };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<LeadAssignmentAgentNotification?> GetLeadAssignmentAgentNotification()
        {
            string storeProcCommand = "select * from leadassignment_agentnotification_get()";
            object? param = new { };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<LeadAssignmentAgentNotification?>(storeProcCommand, param);
        }

        //Lead Notification To Sales

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
