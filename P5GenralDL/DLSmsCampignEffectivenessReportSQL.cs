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
    public class DLSmsCampignEffectivenessReportSQL : CommonDataBaseInteraction, IDLSmsCampignEffectivenessReport
    {
        CommonInfo connection;

        public DLSmsCampignEffectivenessReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsCampignEffectivenessReportSQL(string connectionString)
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
                storeProcCommand = "Sms_CampaignEffectivenessReport";
                param = new { Action = "NotUniqueCount", smsCampaignEffectivenessReport.SmsSendingSettingId, smsCampaignEffectivenessReport.UrlLink };
            }
            else if (smsCampaignEffectivenessReport.IsUniqe == 1)
            {
                storeProcCommand = "Sms_CampaignEffectivenessReport";
                param = new {Action= "UniqueCount", smsCampaignEffectivenessReport.SmsSendingSettingId, smsCampaignEffectivenessReport.UrlLink };
            }

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<List<MLSmsCampaignEffectivenessReport>> GetReportDetails(MLSmsCampaignEffectivenessReport smsCampaignEffectivenessReport, int OffSet, int FetchNext)
        {
            string storeProcCommand = "";
            object[] objDat = new object[4];
            object? param = null;
            List<string> field = null;

            if (smsCampaignEffectivenessReport.IsUniqe == 0)
            {
                storeProcCommand = "Sms_CampaignEffectivenessReport";
                param = new { Action = "NotUniqueData", smsCampaignEffectivenessReport.SmsSendingSettingId, OffSet, FetchNext, smsCampaignEffectivenessReport.UrlLink };
            }
            else if (smsCampaignEffectivenessReport.IsUniqe == 1)
            {
                storeProcCommand = "Sms_CampaignEffectivenessReport";
                param = new { Action = "UniqueData", smsCampaignEffectivenessReport.SmsSendingSettingId, OffSet, FetchNext, smsCampaignEffectivenessReport.UrlLink };
            }

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLSmsCampaignEffectivenessReport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
