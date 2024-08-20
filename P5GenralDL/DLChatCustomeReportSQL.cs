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
    public class DLChatCustomeReportSQL : CommonDataBaseInteraction, IDLChatCustomeReport
    {
        CommonInfo connection = null;
        public DLChatCustomeReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatCustomeReportSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<ChatIpAddress>> IpAddress(int ChatId)
        {
            string storeProcCommand = "Chat_ReportSP_CustomData";
            object? param = new { Action = "GetIpAddress", ChatId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatIpAddress>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<int> GetCountOfSelecCamp(MLChatCustomeReport chatCustomReport)
        {
            string storeProcCommand = "Chat_ReportSP_CustomData";
            object? param = new { Action = "CustomReportCount", chatCustomReport.ChatId, chatCustomReport.FromDate, chatCustomReport.ToDate, chatCustomReport.IpAddress, chatCustomReport.SearchContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public async Task<List<ChatCustomReportData>> GetData(MLChatCustomeReport chatCustomReport, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Chat_ReportSP_CustomData";
            object? param = new { Action = "CustomReportData", chatCustomReport.ChatId, chatCustomReport.FromDate, chatCustomReport.ToDate, chatCustomReport.IpAddress, chatCustomReport.SearchContent, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatCustomReportData>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<ChatAllResponsesForExport>> ExportData(MLChatCustomeReport chatCustomReport, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Chat_ReportSP_CustomData";
            object? param = new { Action = "Export", chatCustomReport.ChatId, chatCustomReport.FromDate, chatCustomReport.ToDate, chatCustomReport.IpAddress, chatCustomReport.SearchContent, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatAllResponsesForExport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
