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
    public class DLChatFormResponsesPG : CommonDataBaseInteraction, IDLChatFormResponses
    {
        CommonInfo connection = null;
        public DLChatFormResponsesPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatFormResponsesPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(ChatFormResponses chatResponses)
        {
            string storeProcCommand = "select chat_formresponses_save(@ChatId, @TrackIp, @VisitorId, @SessionRefer, @ContactId, @Name, @EmailId, @PhoneNumber, @Message, @Referrer, @Country, @StateName,\r\n                @City, @PageUrl, @ResponsedDevice, @ResponsedDeviceType, @ResponsedUserAgent, @IsAdSenseOrAdWord,@SearchKeyword,@UtmTagSource,@UtmMedium,@UtmCampaign,@UtmTerm,@UtmContent)";
            object? param = new
            {
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
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
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
