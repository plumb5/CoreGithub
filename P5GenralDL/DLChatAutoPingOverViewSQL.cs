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
    public class DLChatAutoPingOverViewSQL : CommonDataBaseInteraction, IDLChatAutoPingOverView
    {
        CommonInfo connection = null;
        public DLChatAutoPingOverViewSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatAutoPingOverViewSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(ChatAutoPingOverView AutoPingOverView)
        {
            string storeProcCommand = "ChatAutoPing_OverView";
            object? param = new { Action = "Save", AutoPingOverView.URL, AutoPingOverView.AutoPingCount, AutoPingOverView.ResponseCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Update(ChatAutoPingOverView AutoPingOverView)
        {
            string storeProcCommand = "ChatAutoPing_OverView";
            object? param = new { Action = "Update", AutoPingOverView.URL, AutoPingOverView.AutoPingCount, AutoPingOverView.ResponseCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<List<ChatAutoPingOverView>> GetAutoPingOverViewList(ChatAutoPingOverView AutoPingOverView, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "ChatAutoPing_OverView";
            object? param = new { Action = "GetList", AutoPingOverView.URL, FromDateTime, ToDateTime, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatAutoPingOverView>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
