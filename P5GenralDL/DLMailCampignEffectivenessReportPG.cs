using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;

namespace P5GenralDL
{
    public class DLMailCampignEffectivenessReportPG : CommonDataBaseInteraction, IDLMailCampignEffectivenessReport
    {
        CommonInfo connection;
        public DLMailCampignEffectivenessReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailCampignEffectivenessReportPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount(MLMailCampaignEffectivenessReport mailCampaignEffectivenessReport)
        {
            string storeProcCommand = "";
            object? param = null;

            if (mailCampaignEffectivenessReport.IsUniqe == 0)
            {
                storeProcCommand = "select mail_campaigneffectivenessreport_notuniquecount(@MailSendingSettingId, @UrlLink)";
                param = new { mailCampaignEffectivenessReport.MailSendingSettingId, mailCampaignEffectivenessReport.UrlLink };
            }
            else if (mailCampaignEffectivenessReport.IsUniqe == 1)
            {
                storeProcCommand = "select mail_campaigneffectivenessreport_uniquecount(@MailSendingSettingId, @UrlLink)";
                param = new { mailCampaignEffectivenessReport.MailSendingSettingId, mailCampaignEffectivenessReport.UrlLink };
            }

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<List<MLMailCampaignEffectivenessReport>> GetReportDetails(MLMailCampaignEffectivenessReport mailCampaignEffectivenessReport, int OffSet, int FetchNext)
        {
            string storeProcCommand = "";
            object? param = null;

            if (mailCampaignEffectivenessReport.IsUniqe == 0)
            {
                storeProcCommand = "select * from mail_campaigneffectivenessreport_notuniquedata(@MailSendingSettingId, @OffSet, @FetchNext, @UrlLink)";
                param = new { mailCampaignEffectivenessReport.MailSendingSettingId, OffSet, FetchNext, mailCampaignEffectivenessReport.UrlLink };
            }
            else if (mailCampaignEffectivenessReport.IsUniqe == 1)
            {
                storeProcCommand = "select * from mail_campaigneffectivenessreport_uniquedata(@MailSendingSettingId, @OffSet, @FetchNext, @UrlLink)";
                param = new { mailCampaignEffectivenessReport.MailSendingSettingId, OffSet, FetchNext, mailCampaignEffectivenessReport.UrlLink };
            }

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailCampaignEffectivenessReport>(storeProcCommand, param)).ToList();
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
