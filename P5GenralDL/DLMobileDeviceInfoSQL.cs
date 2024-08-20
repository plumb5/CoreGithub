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
    public class DLMobileDeviceInfoSQL : CommonDataBaseInteraction, IDLMobileDeviceInfo
    {
        readonly CommonInfo connection;
        public DLMobileDeviceInfoSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileDeviceInfoSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> MaxCount(MobileDeviceInfo mobileDeviceInfo, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "MobilePush_DeviceInfo";
            object? param = new {Action= "MaxCount", FromDateTime, ToDateTime, mobileDeviceInfo.DeviceId, mobileDeviceInfo.Name };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<MobileDeviceInfo>> GetReportData(MobileDeviceInfo mobileDeviceInfo, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "MobilePush_DeviceInfo";
            object? param = new { Action = "GetDetails", FromDateTime, ToDateTime, mobileDeviceInfo.DeviceId, mobileDeviceInfo.Name, OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MobileDeviceInfo>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 
        }

        public async Task<Int32> GetGroupMaxCount(MobileDeviceInfo mobPushUser, int GroupId)
        {
            const string storeProcCommand = "MobilePush_DeviceInfo";
            object? param = new { Action = "GetGroupMaxCount", mobPushUser.OS, mobPushUser.DeviceId, mobPushUser.Manufacturer, mobPushUser.Name, GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<MobileDeviceInfo>> GetGroupDetails(MobileDeviceInfo mobPushUser, int Offset, int FetchNext, int GroupId)
        {
            const string storeProcCommand = "MobilePush_DeviceInfo";
            object? param = new { Action = "GetGroupDetails", Offset, FetchNext, mobPushUser.OS, mobPushUser.DeviceId, mobPushUser.Manufacturer, mobPushUser.Name, GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MobileDeviceInfo>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<MLMobileDeviceInfo?> GetMobileDeviceInfo(MobileDeviceInfo mobilePushInfo)
        {
            string storeProcCommand = "MobilePush_DeviceInfo";
            object? param = new { Action = "GetDeviceInfoDetails", mobilePushInfo.DeviceId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLMobileDeviceInfo?>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 
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
