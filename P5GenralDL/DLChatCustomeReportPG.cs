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
    public class DLChatCustomeReportPG : CommonDataBaseInteraction, IDLChatCustomeReport
    {
        CommonInfo connection = null;
        public DLChatCustomeReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatCustomeReportPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<ChatIpAddress>> IpAddress(int ChatId)
        {
            string storeProcCommand = "select * from chat_reportsp_customdata_getipaddress(@ChatId)";
            object? param = new { ChatId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatIpAddress>(storeProcCommand, param)).ToList();

        }

        public async Task<int> GetCountOfSelecCamp(MLChatCustomeReport chatCustomReport)
        {
            string storeProcCommand = "select chat_reportsp_customdata_customreportcount(@ChatId, @FromDate, @ToDate, @IpAddress, @SearchContent)";
            object? param = new { chatCustomReport.ChatId, chatCustomReport.FromDate, chatCustomReport.ToDate, chatCustomReport.IpAddress, chatCustomReport.SearchContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<List<ChatCustomReportData>> GetData(MLChatCustomeReport chatCustomReport, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from chat_reportsp_customdata_customreportdata(@ChatId, @FromDate, @ToDate, @IpAddress, @SearchContent, OffSet, FetchNext)";
            object? param = new { chatCustomReport.ChatId, chatCustomReport.FromDate, chatCustomReport.ToDate, chatCustomReport.IpAddress, chatCustomReport.SearchContent, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatCustomReportData>(storeProcCommand, param)).ToList();
        }

        public async Task<List<ChatAllResponsesForExport>> ExportData(MLChatCustomeReport chatCustomReport, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from chat_reportsp_customdata_export(@ChatId, @FromDate, @ToDate, @IpAddress, @SearchContent, @OffSet,@FetchNext)";
            object? param = new { chatCustomReport.ChatId, chatCustomReport.FromDate, chatCustomReport.ToDate, chatCustomReport.IpAddress, chatCustomReport.SearchContent, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatAllResponsesForExport>(storeProcCommand, param)).ToList();
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
