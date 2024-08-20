using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using IP5GenralDL;
using System.Data;

namespace P5GenralDL
{
    public class DLChatAgentReportSQL : CommonDataBaseInteraction, IDLChatAgentReport
    {
        CommonInfo connection = null;
        public DLChatAgentReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatAgentReportSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> GetCountOfSelecCamp(MLChatAgentReport agentReport)
        {
            string storeProcCommand = "Chat_ReportSP_AgentReport";
            object? param = new { Action = "NGetMaxCount", agentReport.ChatId, agentReport.UserId, agentReport.FromDate, agentReport.ToDate };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<ChatAgentReport>> GetAgentData(MLChatAgentReport agentReport, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Chat_ReportSP_AgentReport";
            object? param = new { Action = "NAgentData", agentReport.ChatId, agentReport.UserId, agentReport.FromDate, agentReport.ToDate, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatAgentReport>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<ChatAllAgentsName>> GetAllAgentsName(MLChatAgentReport agentReport)
        {
            string storeProcCommand = "Chat_ReportSP_AgentReport";
            object? param = new { Action = "GetAllAgentName", agentReport.ChatId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatAllAgentsName>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        #region Dispose Method

        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
