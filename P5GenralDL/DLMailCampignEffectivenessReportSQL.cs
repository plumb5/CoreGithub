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
    public class DLMailCampignEffectivenessReportSQL : CommonDataBaseInteraction, IDLMailCampignEffectivenessReport
    {
        CommonInfo connection;
        public DLMailCampignEffectivenessReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailCampignEffectivenessReportSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount(MLMailCampaignEffectivenessReport mailCampaignEffectivenessReport)
        {
            string storeProcCommand = "";
            object? param = null;

            if (mailCampaignEffectivenessReport.IsUniqe == 0)
            {
                storeProcCommand = "Mail_CampaignEffectivenessReport";
                param = new { Action = "NotUniqueCount", mailCampaignEffectivenessReport.MailSendingSettingId, mailCampaignEffectivenessReport.UrlLink };
            }
            else if (mailCampaignEffectivenessReport.IsUniqe == 1)
            {
                storeProcCommand = "Mail_CampaignEffectivenessReport";
                param = new { Action = "UniqueCount", mailCampaignEffectivenessReport.MailSendingSettingId, mailCampaignEffectivenessReport.UrlLink };
            }

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLMailCampaignEffectivenessReport>> GetReportDetails(MLMailCampaignEffectivenessReport mailCampaignEffectivenessReport, int OffSet, int FetchNext)
        {
            string storeProcCommand = "";
            object? param = null;

            if (mailCampaignEffectivenessReport.IsUniqe == 0)
            {
                storeProcCommand = "Mail_CampaignEffectivenessReport";
                param = new { Action = "NotUniqueData", mailCampaignEffectivenessReport.MailSendingSettingId, OffSet, FetchNext, mailCampaignEffectivenessReport.UrlLink };
            }
            else if (mailCampaignEffectivenessReport.IsUniqe == 1)
            {
                storeProcCommand = "Mail_CampaignEffectivenessReport";
                param = new { Action = "UniqueData", mailCampaignEffectivenessReport.MailSendingSettingId, OffSet, FetchNext, mailCampaignEffectivenessReport.UrlLink };
            }

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLMailCampaignEffectivenessReport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
