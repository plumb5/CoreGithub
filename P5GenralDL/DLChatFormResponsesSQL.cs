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
    public class DLChatFormResponsesSQL : CommonDataBaseInteraction, IDLChatFormResponses
    {
        CommonInfo connection = null;
        public DLChatFormResponsesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatFormResponsesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(ChatFormResponses chatResponses)
        {
            string storeProcCommand = "Chat_FormResponses";
            object? param = new
            {
                Action = "Save",
                chatResponses.ChatId,
                chatResponses.TrackIp,
                chatResponses.VisitorId,
                chatResponses.SessionRefer,
                chatResponses.ContactId,
                chatResponses.Name,
                chatResponses.EmailId,
                chatResponses.PhoneNumber,
                chatResponses.Message,
                chatResponses.Referrer,
                chatResponses.Country,
                chatResponses.StateName,
                chatResponses.City,
                chatResponses.PageUrl,
                chatResponses.ResponsedDevice,
                chatResponses.ResponsedDeviceType,
                chatResponses.ResponsedUserAgent,
                chatResponses.IsAdSenseOrAdWord,
                chatResponses.SearchKeyword,
                chatResponses.UtmTagSource,
                chatResponses.UtmMedium,
                chatResponses.UtmCampaign,
                chatResponses.UtmTerm,
                chatResponses.UtmContent
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
