using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWebLogsPG : CommonDataBaseInteraction, IDLWebLogs
    {
        CommonInfo connection;
        public DLWebLogsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebLogsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> SaveLog(WebLogs logs)
        {
            string storeProcCommand = "select * from web_logs_save(@AdsId,@UserInfoUserId,@UserName,@UserEmailId,@Controller,@ChannelType,@Actions,@RequestContent,@IpAddress)";
            object? param = new { logs.AdsId, logs.UserInfoUserId, logs.UserName, logs.UserEmailId, logs.Controller, logs.ChannelType, logs.Actions, logs.RequestContent, logs.IpAddress };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<bool> UpdateLog(WebLogs logs)
        {
            string storeProcCommand = "select * from web_logs_update(@Id,@ResponseContent,@ActionDescription)";
            object? param = new { logs.Id, logs.ResponseContent, logs.ActionDescription };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<Int32> GetMaxCount(WebLogs logDetails, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from web_logs_getmaxcount(@FromDateTime, @ToDateTime,@AdsId)";
            object? param = new { FromDateTime, ToDateTime, logDetails.AdsId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<WebLogs>> GetReportData(WebLogs logDetails, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from web_logs_getlist(@FromDateTime, @ToDateTime, @OffSet, @FetchNext, @AdsId)";
            object? param = new { FromDateTime, ToDateTime, OffSet, FetchNext, logDetails.AdsId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebLogs>(storeProcCommand, param)).ToList();

        }

        public async Task<List<WebLogs>> GetLogsForNotification(int AdsId)
        {
            string storeProcCommand = "select * from web_logs_getlogsfornotification(@AdsId)";
            object? param = new { AdsId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebLogs>(storeProcCommand, param)).ToList();

        }
    }
}
