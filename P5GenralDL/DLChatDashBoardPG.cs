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
    public class DLChatDashBoardPG : CommonDataBaseInteraction, IDLChatDashBoard
    {
        CommonInfo connection = null;
        public DLChatDashBoardPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatDashBoardPG(string connectionString)
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

            string storeProcCommand = "";
            object? param = null;

            if (Duration == 1)
            {
                storeProcCommand = "select * from chat_dashboardreport_chatdashboardreport_day(@ChatId, @FromDateTime, @ToDateTime)";
                param = new { ChatId, FromDateTime, ToDateTime };
            }
            else if (Duration == 2 || Duration == 3)
            {
                storeProcCommand = "select * from chat_dashboardreport_chatdashboardreport_monthorweek(@ChatId, @FromDateTime, @ToDateTime)";
                param = new { ChatId, FromDateTime, ToDateTime };
            }
            else if (Duration == 4 || Duration == 5)
            {
                storeProcCommand = "select * from chat_dashboardreport_chatdashboardreport_year(@ChatId, @FromDateTime, @ToDateTime)";
                param = new { ChatId, FromDateTime, ToDateTime };
            }

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatDashBoard>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLChatDashBoard>> BindChatImpressionsCount(int ChatId, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from chat_dashboardreport_overallimpression(@ChatId, @FromDateTime, @ToDateTime)";
            object? param = new { ChatId, FromDateTime, ToDateTime };


            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatDashBoard>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLChatDashBoard>> TopFiveConversion(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from chat_dashboardreport_topfiveconversion(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatDashBoard>(storeProcCommand, param)).ToList();
        }

        public async Task<List<MLChatDashBoard>> TopFiveConversionUrl(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from chat_dashboardreport_topfiveconversionurl(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatDashBoard>(storeProcCommand, param)).ToList();
        }

        public async Task<MLChatDashBoard?> Conversations(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from chat_dashboardreport_conversations(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLChatDashBoard?>(storeProcCommand, param);
        }

        public async Task<List<MLChatDashBoard>> TopThreeAgents(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from chat_dashboardreport_topthreeagents(@FromDateTime, @ToDateTime)";
            object? param = new { FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatDashBoard>(storeProcCommand, param)).ToList();
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
