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
    public class DLCRMFilterConditionSQL : CommonDataBaseInteraction, IDLCRMFilterCondition
    {
        CommonInfo connection = null;
        public DLCRMFilterConditionSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLCRMFilterConditionSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(CRMFilterCondition filterCondition)
        {
            string storeProcCommand = "CRM_FilterCondition";
            object? param = new { Action = "Save", filterCondition.ConditionIdentifier, filterCondition.ConditionJson, filterCondition.ConditionQuery, filterCondition.SMSTemplateId, filterCondition.SMSIsPromotionalOrTransactional, filterCondition.MailTemplateId, filterCondition.MailIsPromotionalOrTransactional, filterCondition.MailSubject, filterCondition.MailFromName, filterCondition.MailFromEmailId, filterCondition.MailReplyToEmailId, filterCondition.WhatsAppHsmType, filterCondition.GroupId, filterCondition.IsAddToGroup, filterCondition.IsRemoveFromGroup, filterCondition.IsActive };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(CRMFilterCondition filterCondition)
        {
            string storeProcCommand = "CRM_FilterCondition";
            object? param = new { Action = "Update", filterCondition.Id, filterCondition.ConditionIdentifier, filterCondition.ConditionJson, filterCondition.ConditionQuery, filterCondition.SMSTemplateId, filterCondition.SMSIsPromotionalOrTransactional, filterCondition.MailTemplateId, filterCondition.MailIsPromotionalOrTransactional, filterCondition.MailSubject, filterCondition.MailFromName, filterCondition.MailFromEmailId, filterCondition.MailReplyToEmailId, filterCondition.WhatsAppHsmType, filterCondition.GroupId, filterCondition.IsAddToGroup, filterCondition.IsRemoveFromGroup };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<CRMFilterCondition?> GetFilterReportById(int Id)
        {
            string storeProcCommand = "CRM_FilterCondition";
            object? param = new { Action = "GetFilterReportById", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<CRMFilterCondition>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<CRMFilterCondition>> GetAllFilterCondition()
        {
            string storeProcCommand = "CRM_FilterCondition";
            object? param = new { Action = "GetAllFilterCondition" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<CRMFilterCondition>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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

