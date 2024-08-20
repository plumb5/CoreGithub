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
    public class DLChatDashBoardSQL : CommonDataBaseInteraction, IDLChatDashBoard
    {
        CommonInfo connection = null;
        public DLChatDashBoardSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatDashBoardSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<MLChatDashBoard>> GetChatReport(int ChatId, int Duration, DateTime FromDateTime, DateTime ToDateTime)
        {
            //For avoiding time data in dashbord
            //Start
            if (Duration == 1)
                Duration = 2;
            //End            


            string storeProcCommand = "Chat_DashboardReport";
            object? param = new { Action = "ChatDashboardReport", ChatId, Duration, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatDashBoard>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLChatDashBoard>> BindChatImpressionsCount(int ChatId, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Chat_DashboardReport";
            object? param = new { Action = "OverAllImpression", ChatId, FromDateTime, ToDateTime };


            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatDashBoard>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLChatDashBoard>> TopFiveConversion(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Chat_DashboardReport";
            object? param = new { Action = "TopFiveConversion", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatDashBoard>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<List<MLChatDashBoard>> TopFiveConversionUrl(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Chat_DashboardReport";
            object? param = new { Action = "TopFiveConversionUrl", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatDashBoard>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<MLChatDashBoard?> Conversations(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Chat_DashboardReport";
            object? param = new { Action = "Conversations", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLChatDashBoard?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MLChatDashBoard>> TopThreeAgents(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Chat_DashboardReport";
            object? param = new { Action = "TopThreeAgents", FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatDashBoard>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
