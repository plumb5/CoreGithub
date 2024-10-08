﻿using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DBInteraction;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLCampaignOverViewSQL : CommonDataBaseInteraction, IDLCampaignOverView
    {
        CommonInfo connection;
        public DLCampaignOverViewSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLCampaignOverViewSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<int> CampaignMaxCount(DateTime FromDateTime, DateTime ToDateTime, string CampaignName, string TemplateName, string ChannelType)
        {
            string storeProcCommand = "Campaign_OverView";
            object? param = new { Action= "GetMaxCount", FromDateTime, ToDateTime, CampaignName, TemplateName, ChannelType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<DataSet> GetCampaignReportDetails(DateTime fromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string CampaignName, string TemplateName, string ChannelType)
        {
            string storeProcCommand = "Campaign_OverView";
            object? param = new { Action = "GetReportDetails", fromDateTime, ToDateTime, OffSet, FetchNext, CampaignName, TemplateName, ChannelType };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;

        }

        public async Task<DataSet> GetTemplateDetails(string ChannelType)
        {
            string storeProcCommand = "Campaign_OverView";
            object? param = new { Action = "GetTemplateDetails", ChannelType };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;

        }

        public async Task<DataSet> GetCampaignDetails(string ChannelType)
        {
            string storeProcCommand = "Campaign_OverView";
            object? param = new { Action = "GetCampaignDetails", ChannelType };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;

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