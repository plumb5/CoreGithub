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
    public class DLChatAutoPingOverViewPG : CommonDataBaseInteraction, IDLChatAutoPingOverView
    {
        CommonInfo connection = null;
        public DLChatAutoPingOverViewPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatAutoPingOverViewPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(ChatAutoPingOverView AutoPingOverView)
        {
            string storeProcCommand = "select chatautoping_overview_save(@URL, @AutoPingCount, @ResponseCount)";
            object? param = new { AutoPingOverView.URL, AutoPingOverView.AutoPingCount, AutoPingOverView.ResponseCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);

        }

        public async Task<bool> Update(ChatAutoPingOverView AutoPingOverView)
        {
            string storeProcCommand = "select chatautoping_overview_update(@URL, @AutoPingCount, @ResponseCount)";
            object? param = new { AutoPingOverView.URL, AutoPingOverView.AutoPingCount, AutoPingOverView.ResponseCount };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<List<ChatAutoPingOverView>> GetAutoPingOverViewList(ChatAutoPingOverView AutoPingOverView, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from chatautoping_overview_getlist(@URL,@FromDateTime, @ToDateTime, @OffSet, @FetchNext)";
            object? param = new { AutoPingOverView.URL, FromDateTime, ToDateTime, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatAutoPingOverView>(storeProcCommand, param)).ToList();
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
