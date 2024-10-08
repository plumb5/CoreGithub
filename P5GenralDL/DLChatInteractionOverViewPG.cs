﻿using Dapper;
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
    public class DLChatInteractionOverViewPG : CommonDataBaseInteraction, IDLChatInteractionOverView
    {
        CommonInfo connection = null;
        public DLChatInteractionOverViewPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLChatInteractionOverViewPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(ChatInteractionOverView chatOverView)
        {
            string storeProcCommand = "select chatinteraction_overview_save(@ChatUserId, @LastAgentServedBy, @InitiatedByUser, @IsCompleted, @FeedBack, @FeedBackForAgentId, @IsTransferd, @IsConvertedToLeadOrCustomer, @ChatInitiatedOnPageUrl, @ResponseCount, @IsMissed)";
            object? param = new { chatOverView.ChatUserId, chatOverView.LastAgentServedBy, chatOverView.InitiatedByUser, chatOverView.IsCompleted, chatOverView.FeedBack, chatOverView.FeedBackForAgentId, chatOverView.IsTransferd, chatOverView.IsConvertedToLeadOrCustomer, chatOverView.ChatInitiatedOnPageUrl, chatOverView.ResponseCount, chatOverView.IsMissed };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<bool> Update(ChatInteractionOverView chatOverView)
        {
            string storeProcCommand = "select chatinteraction_overview_update(@ChatUserId, @LastAgentServedBy, @InitiatedByUser, @IsCompleted, @FeedBack, @FeedBackForAgentId, @IsTransferd, @IsConvertedToLeadOrCustomer, @ChatInitiatedOnPageUrl, @ResponseCount, @IsMissed, @IsFormFilled)";
            object? param = new { chatOverView.ChatUserId, chatOverView.LastAgentServedBy, chatOverView.InitiatedByUser, chatOverView.IsCompleted, chatOverView.FeedBack, chatOverView.FeedBackForAgentId, chatOverView.IsTransferd, chatOverView.IsConvertedToLeadOrCustomer, chatOverView.ChatInitiatedOnPageUrl, chatOverView.ResponseCount, chatOverView.IsMissed, chatOverView.IsFormFilled };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }
        public async Task<List<ChatInteractionOverView>> GetList(ChatInteractionOverView chatOverView, DateTime FromDateTime, DateTime ToDateTime)
        {
            try
            {
                string storeProcCommand = "select *  from chatinteraction_overview_getlist(@ChatUserId, @LastAgentServedBy, @InitiatedByUser, @IsCompleted, @FeedBack, @FeedBackForAgentId, @IsTransferd, @IsConvertedToLeadOrCustomer, @ChatInitiatedOnPageUrl, @ResponseCount, @IsMissed, @FromDateTime, @ToDateTime)";
                object? param = new { chatOverView.ChatUserId, chatOverView.LastAgentServedBy, chatOverView.InitiatedByUser, chatOverView.IsCompleted, chatOverView.FeedBack, chatOverView.FeedBackForAgentId, chatOverView.IsTransferd, chatOverView.IsConvertedToLeadOrCustomer, chatOverView.ChatInitiatedOnPageUrl, chatOverView.ResponseCount, chatOverView.IsMissed, FromDateTime, ToDateTime };

                using var db = GetDbConnection(connection.Connection);
                return (await db.QueryAsync<ChatInteractionOverView>(storeProcCommand, param)).ToList();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<MLChatInteractionOverView>> GetImpressionList(ChatInteractionOverView chatOverView, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select *  from chatinteraction_overview_getimpressionlist(@ChatInitiatedOnPageUrl, @FromDateTime, @ToDateTime, @OffSet, @FetchNext)";
            object? param = new { chatOverView.ChatInitiatedOnPageUrl, FromDateTime, ToDateTime, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLChatInteractionOverView>(storeProcCommand, param)).ToList();
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