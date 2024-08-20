﻿using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    internal class DLWhatsAppDashboardReportPG : CommonDataBaseInteraction, IDLWhatsaAppDashboardReport
    {
        CommonInfo connection;
        public DLWhatsAppDashboardReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public async Task<IEnumerable<MLWhatsAppDashboardCampaignEffectiveness>>  GetCampaignEffectivenessData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string storeProcCommand = "select * from whatsapp_dashboardreport_çampaigneffectiveness(@FromDateTime, @ToDateTime )"; 
            object? param = new { FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLWhatsAppDashboardCampaignEffectiveness>(storeProcCommand, param);
        }
        public async Task<IEnumerable<MLWhatsAppDashboardSubcribers>> GetWhatsAppDashboardSubcribersData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string storeProcCommand = "select * from whatsapp_dashboardreport_whatsappdashboardsubcribers(@FromDateTime, @ToDateTime)";
           
            object? param = new { FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLWhatsAppDashboardSubcribers>(storeProcCommand, param);
        }
        public async Task<IEnumerable<MLWhatsAppDashboardDelivery>> GetWhatsAppDashboardDeliveryData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string storeProcCommand = "select * from whatsapp_dashboardreport_whatsappdashboarddelivery(@FromDateTime, @ToDateTime )";
             
            object? param = new { FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLWhatsAppDashboardDelivery>(storeProcCommand, param);
        }
        public async Task<IEnumerable<MLWhatsAppDashboardWhatsAppPerformanceOverTime>> GetWhatsAppPerformanceOverTimeData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            
            string storeProcCommand = "select * from whatsapp_dashboardreport_whatsappdashboardperformanceovertime( @FromDateTime, @ToDateTime)";
             
            object? param = new { FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLWhatsAppDashboardWhatsAppPerformanceOverTime>(storeProcCommand, param);
        }
        public async Task<IEnumerable<MLWhatsAppDashboardDeliveredVsFailed>> GetWhatsAppDashboardDeliveredFailedData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            string storeProcCommand = "select * from whatsapp_dashboardreport_whatsappdashboarddeliveredvsfaileddata(@FromDateTime, @ToDateTime)";
            
            object? param = new { FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLWhatsAppDashboardDeliveredVsFailed>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MLWhatsAppDashboardBouncedVsRejected>> GetWhatsAppDashboardBouncedRejectedData(string fromdate, string todate)
        {
            DateTime FromDateTime = DateTime.ParseExact(fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            string storeProcCommand = "select * from whatsapp_dashboardreport_whatsappdashboardbouncedvsrejected(@FromDateTime, @ToDateTime)";
            
            object? param = new { FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLWhatsAppDashboardBouncedVsRejected>(storeProcCommand, param);
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

