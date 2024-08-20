using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLChatResponsesAllPG : CommonDataBaseInteraction, IDLChatResponsesAll
    {
        CommonInfo connection = null;
        public DLChatResponsesAllPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatResponsesAllPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> GetCountOfSelecCamp(int ChatId, string IpAddress, string SearchContent, int MinChatRepeatTime, int MaxChatRepeatTime, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select chat_reportsp_allresponses_allchatcount(@ChatId, @IpAddress, @SearchContent, @FromDateTime, @ToDateTime, @MinChatRepeatTime, @MaxChatRepeatTime)";
            object? param = new { ChatId, IpAddress, SearchContent, FromDateTime, ToDateTime, MinChatRepeatTime, MaxChatRepeatTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<List<ChatAllResponses>> AllChat(int ChatId, string IpAddress, string SearchContent, int MinChatRepeatTime, int MaxChatRepeatTime, int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select *  from chat_reportsp_allresponses_allchatresp(@ChatId, @OffSet, @FetchNext,@IpAddress, @SearchContent, @FromDateTime, @ToDateTime, @MinChatRepeatTime, @MaxChatRepeatTime)";
            object? param = new { ChatId, OffSet, FetchNext, IpAddress, SearchContent, FromDateTime, ToDateTime, MinChatRepeatTime, MaxChatRepeatTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ChatAllResponses>(storeProcCommand, param)).ToList();
        }

        public async Task<List<ChatAllResponsesForExport>> GetAllChatToExport(int ChatId, string IpAddress, string SearchContent, int MinChatRepeatTime, int MaxChatRepeatTime, int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select *  from chat_reportsp_allresponses_getallchattoexport(@ChatId,  @OffSet, @FetchNext,@IpAddress, @SearchContent, @FromDateTime, @ToDateTime, @MinChatRepeatTime, @MaxChatRepeatTime)";
            object? param = new { ChatId, OffSet, FetchNext, IpAddress, SearchContent, FromDateTime, ToDateTime, MinChatRepeatTime, MaxChatRepeatTime };

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

