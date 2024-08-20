using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSmsCampignEffectivenessReportPG : CommonDataBaseInteraction, IDLSmsCampignEffectivenessReport
    {
        CommonInfo connection;

        public DLSmsCampignEffectivenessReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsCampignEffectivenessReportPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount(MLSmsCampaignEffectivenessReport smsCampaignEffectivenessReport)
        {
            string storeProcCommand = "";
            object[] objDat = new object[4];
            object? param = null;


            if (smsCampaignEffectivenessReport.IsUniqe == 0)
            {
                storeProcCommand = "select * from sms_campaigneffectivenessreport_notuniquecount(@SmsSendingSettingId, @UrlLink)";
                param = new { smsCampaignEffectivenessReport.SmsSendingSettingId, smsCampaignEffectivenessReport.UrlLink };

            }
            else if (smsCampaignEffectivenessReport.IsUniqe == 1)
            {
                storeProcCommand = "select * from sms_campaigneffectivenessreport_uniquecount(@SmsSendingSettingId, @UrlLink)";
                param = new { smsCampaignEffectivenessReport.SmsSendingSettingId, smsCampaignEffectivenessReport.UrlLink };
            }

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<List<MLSmsCampaignEffectivenessReport>> GetReportDetails(MLSmsCampaignEffectivenessReport smsCampaignEffectivenessReport, int OffSet, int FetchNext)
        {
            string storeProcCommand = "";
            object[] objDat = new object[4];
            object? param = null;
            List<string> field = null;

            if (smsCampaignEffectivenessReport.IsUniqe == 0)
            {
                storeProcCommand = "select * from sms_campaigneffectivenessreport_notuniquedata(@SmsSendingSettingId,@OffSet, @FetchNext, @UrlLink)";
                param = new { smsCampaignEffectivenessReport.SmsSendingSettingId, OffSet, FetchNext, smsCampaignEffectivenessReport.UrlLink };

            }
            else if (smsCampaignEffectivenessReport.IsUniqe == 1)
            {
                storeProcCommand = "select * from sms_campaigneffectivenessreport_uniquedata(@SmsSendingSettingId,@OffSet, @FetchNext, @UrlLink)";
                param = new { smsCampaignEffectivenessReport.SmsSendingSettingId, OffSet, FetchNext, smsCampaignEffectivenessReport.UrlLink };
            }
            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsCampaignEffectivenessReport>(storeProcCommand, param)).ToList();

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
