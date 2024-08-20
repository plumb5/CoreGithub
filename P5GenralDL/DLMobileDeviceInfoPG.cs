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
    public class DLMobileDeviceInfoPG : CommonDataBaseInteraction, IDLMobileDeviceInfo
    {
        readonly CommonInfo connection;
        public DLMobileDeviceInfoPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileDeviceInfoPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> MaxCount(MobileDeviceInfo mobileDeviceInfo, DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select mobilepush_deviceinfo_maxcount(@FromDateTime, @ToDateTime, @DeviceId, @Name )"; 
            object? param = new { FromDateTime, ToDateTime, mobileDeviceInfo.DeviceId, mobileDeviceInfo.Name };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MobileDeviceInfo>> GetReportData(MobileDeviceInfo mobileDeviceInfo, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from mobilepush_deviceinfo_getdetails(@FromDateTime, @ToDateTime, @DeviceId, @Name, @OffSet, @FetchNext )"; 
            object? param = new { FromDateTime, ToDateTime, mobileDeviceInfo.DeviceId, mobileDeviceInfo.Name, OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MobileDeviceInfo>(storeProcCommand, param);
        }

        public async Task<Int32> GetGroupMaxCount(MobileDeviceInfo mobPushUser, int GroupId)
        {
            const string storeProcCommand = "select mobilepush_deviceinfo_getgroupmaxcount(@OS, @DeviceId, @Manufacturer, @Name, @GroupId)"; 
            object? param = new { mobPushUser.OS, mobPushUser.DeviceId, mobPushUser.Manufacturer, mobPushUser.Name, GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MobileDeviceInfo>> GetGroupDetails(MobileDeviceInfo mobPushUser, int Offset, int FetchNext, int GroupId)
        {
            const string storeProcCommand = "select * from mobilepush_deviceinfo_getgroupdetails(@Offset, @FetchNext, @OS, @DeviceId, @Manufacturer, @Name, @GroupId)"; 
            object? param = new { Offset, FetchNext, mobPushUser.OS, mobPushUser.DeviceId, mobPushUser.Manufacturer, mobPushUser.Name, GroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MobileDeviceInfo>(storeProcCommand, param);
        }

        public async Task<MLMobileDeviceInfo?> GetMobileDeviceInfo(MobileDeviceInfo mobilePushInfo)
        {
            string storeProcCommand = "select * from mobilepush_deviceinfo_getdeviceinfodetails(@DeviceId)"; 
            object? param = new { mobilePushInfo.DeviceId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLMobileDeviceInfo?>(storeProcCommand, param);
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
