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
    public class DLWorkFlowBulkMailSentPG : CommonDataBaseInteraction, IDLWorkFlowBulkMailSent
    {
        CommonInfo connection;
        public DLWorkFlowBulkMailSentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWorkFlowBulkMailSentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> DeleteAllTheDataWhichAreInQuque(int WorkFlowId)
        {
            string storeProcCommand = "select * from workflow_mailbulkinsert_deleteallthedatawhichareinquque(@WorkFlowId)";
            object? param = new { WorkFlowId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<long> GetTotalBulkMail(int MailSendingSettingId, int WorkFlowId)
        {
            string storeProcCommand = "select * from workflow_mailbulkinsert_gettotalbulkmail(@MailSendingSettingId,@WorkFlowId)";
            object? param = new { MailSendingSettingId,  WorkFlowId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);
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

