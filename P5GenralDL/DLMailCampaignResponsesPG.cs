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
    public class DLMailCampaignResponsesPG : CommonDataBaseInteraction, IDLMailCampaignResponses
    {
        CommonInfo connection = null;
        public DLMailCampaignResponsesPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailCampaignResponsesPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<MLMailCampaignResponses>> GetResponseData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, int mailCampaignId, int mailTemplateId)
        {
            string storeProcCommand = "select *  from mail_campaignreport_mailreportwithpaging(@FromDateTime, @ToDateTime, @OffSet, @FetchNext, @MailCampaignId, @MailTemplateId )";
            object? param = new { FromDateTime, ToDateTime, OffSet, FetchNext, mailCampaignId, mailTemplateId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailCampaignResponses>(storeProcCommand, param)).ToList();
        }
        public async Task<int> MaxCount(DateTime FromDateTime, DateTime ToDateTime, int mailCampaignId, int mailTemplateId)
        {
            string storeProcCommand = "select * from mail_campaignreport_mailreportmaxrowcnt(@FromDateTime, @ToDateTime, @MailCampaignId, @MailTemplateId)";
            object? param = new { FromDateTime, ToDateTime, mailCampaignId, mailTemplateId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLMailCampaignResponses>> GetABTestingResponseData(DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, int mailCampaignId)
        {
            string storeProcCommand = "select *  from mail_campaignreport_abtestingcampaignreport(@FromDateTime, @ToDateTime, @OffSet, @FetchNext, @MailCampaignId )";
            object? param = new { FromDateTime, ToDateTime, OffSet, FetchNext, mailCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailCampaignResponses>(storeProcCommand, param)).ToList();
        }
        public async Task<int> ABTestingMaxCount(DateTime FromDateTime, DateTime ToDateTime, int mailCampaignId)
        {
            string storeProcCommand = "select * from mail_campaignreport_abtestingmaxrowcnt(@FromDateTime, @ToDateTime, @MailCampaignId)";
            object? param = new { FromDateTime, ToDateTime, mailCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
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

