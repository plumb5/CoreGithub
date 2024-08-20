using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;

namespace P5GenralDL
{
    public class DLMailCampaignResponsesSQL : CommonDataBaseInteraction, IDLMailCampaignResponses
    {
        CommonInfo connection = null;
        public DLMailCampaignResponsesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailCampaignResponsesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<MLMailCampaignResponses>> GetResponseData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, int mailCampaignId, int mailTemplateId)
        {
            string storeProcCommand = "Mail_CampaignReport";
            object? param = new { @Action = "MailReportWithPaging", FromDateTime, ToDateTime, OffSet, FetchNext, mailCampaignId, mailTemplateId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailCampaignResponses>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<int> MaxCount(DateTime FromDateTime, DateTime ToDateTime, int mailCampaignId, int mailTemplateId)
        {
            string storeProcCommand = "Mail_CampaignReport";
            object? param = new { @Action = "MailReportMaxRowCnt", FromDateTime, ToDateTime, mailCampaignId, mailTemplateId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLMailCampaignResponses>> GetABTestingResponseData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, int mailCampaignId)
        {
            string storeProcCommand = "Mail_CampaignReport";
            object? param = new { @Action = "ABTestingCampaignReport", FromDateTime, ToDateTime, OffSet, FetchNext, mailCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailCampaignResponses>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<int> ABTestingMaxCount(DateTime FromDateTime, DateTime ToDateTime, int mailCampaignId)
        {
            string storeProcCommand = "Mail_CampaignReport";
            object? param = new { @Action = "ABTestingMaxRowCnt", FromDateTime, ToDateTime, mailCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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

