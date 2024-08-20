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
    public class DLLeadAssignmentAgentNotificationSQL : CommonDataBaseInteraction, IDLLeadAssignmentAgentNotification
    {
        CommonInfo connection;
        public DLLeadAssignmentAgentNotificationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLeadAssignmentAgentNotificationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        //Lead Notification

        public async Task<Int32> SaveLeadAssignmentAgentNotification(LeadAssignmentAgentNotification lmsleadassigntouser)
        {
            string storeProcCommand = "LeadAssignment_AgentNotification";
            object? param = new { Action = "Save", lmsleadassigntouser.Mail, lmsleadassigntouser.Sms, lmsleadassigntouser.WhatsApp };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<LeadAssignmentAgentNotification?> GetLeadAssignmentAgentNotification()
        {
            string storeProcCommand = "LeadAssignment_AgentNotification";
            object? param = new { Action = "Get" };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<LeadAssignmentAgentNotification?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
