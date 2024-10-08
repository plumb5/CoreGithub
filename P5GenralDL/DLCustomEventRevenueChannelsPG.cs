﻿using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBInteraction;
using Dapper;
using IP5GenralDL;

namespace P5GenralDL
{
    public class DLCustomEventRevenueChannelsPG : CommonDataBaseInteraction, IDLCustomEventRevenueChannels
    {
        CommonInfo connection;
        public DLCustomEventRevenueChannelsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<DataSet> GetDayWiseRevenue(string EventName, string EventPriceColumn, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from customevents_revenuechannels_getdaywiserevenue(@EventName, @EventPriceColumn, @FromDateTime, @ToDateTime)";

            object? param = new { EventName, EventPriceColumn, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetChannelCount(string EventName, string EventPriceColumn, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from customevents_revenuechannels_getchannelcount( @EventName, @EventPriceColumn, @FromDateTime, @ToDateTime )";
            object? param = new { EventName, EventPriceColumn, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<Int32> GetRevenueMaxCount(string Channel, string EventName, string EventPriceColumn, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select customevents_revenuechannels_getmaxcount(@Channel, @EventName, @EventPriceColumn, @FromDateTime, @ToDateTime)";
            object? param = new { Channel, EventName, EventPriceColumn, FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<DataSet> GetRevenueData(string Channel, string EventName, string EventPriceColumn, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from customevents_revenuechannels_getrevenuedata(@Channel, @EventName, @EventPriceColumn, @FromDateTime, @ToDateTime, @OffSet, @FetchNext)";
            object? param = new { Channel, EventName, EventPriceColumn, FromDateTime, ToDateTime, OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<Int32> GetIndividualRevenueCount(string Channel, int CampaignId, string EventName, DateTime FromDateTime, DateTime ToDateTime, Int16 CampignType)
        {
            string storeProcCommand = "select customevents_revenuechannels_getindividualrevenuecount(@Channel, @CampaignId, @EventName, @FromDateTime, @ToDateTime, @CampignType)";

            object? param = new { Channel, CampaignId, EventName, FromDateTime, ToDateTime, CampignType };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<Customevents>> GetIndividualRevenueData(string Channel, int CampaignId, string EventName, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, Int16 CampignType)
        {
            string storeProcCommand = "select * from customevents_revenuechannels_getindividualrevenuedata(@Channel, @CampaignId, @EventName, @FromDateTime, @ToDateTime, @OffSet, @FetchNext, @CampignType)";
            object? param = new { Channel, CampaignId, EventName, FromDateTime, ToDateTime, OffSet, FetchNext, CampignType };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Customevents>(storeProcCommand, param);
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
