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
    public class DLWhatsAppReportSQL : CommonDataBaseInteraction, IDLWhatsAppReport
    {
        readonly CommonInfo connection;
        public DLWhatsAppReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public async Task<int> MaxCount(DateTime? FromDateTime, DateTime? ToDateTime, string CampaignName, string TemplateName, int WhatsAppSendingSettingId)
        {
            string storeProcCommand = "WhatsApp_ReportDetails";
            object? param = new { Action = "GetMaxCount", FromDateTime, ToDateTime, CampaignName, TemplateName, WhatsAppSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLWhatsAppReport>> GetReportData(DateTime? FromDateTime, DateTime? ToDateTime, int OffSet, int FetchNext, string CampaignName = null, string TemplateName = null, int WhatsAppSendingSettingId = 0)
        {
            string storeProcCommand = "WhatsApp_ReportDetails";
            object? param = new { Action = "GetReportData", FromDateTime, ToDateTime, OffSet, FetchNext, CampaignName, TemplateName, WhatsAppSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLWhatsAppReport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
