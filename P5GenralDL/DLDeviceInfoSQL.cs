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
    internal class DLDeviceInfoSQL : CommonDataBaseInteraction, IDLDeviceInfo
    {
        CommonInfo connection;
        public DLDeviceInfoSQL()
        {
            connection = GetDBConnection();
        }

        public DLDeviceInfoSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<DeviceInfo?> GetDeviceInfo(string useragent)
        {
            string storeProcCommand = "DeviceInfo_Details";
            object? param = new { Action= "GET", useragent };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<DeviceInfo?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<DeviceInfo>> GetDeviceInfoByDeviceId(List<int> ListOfIds)
        {
            string storeProcCommand = "DeviceInfo_Details";
            object? param = new { Action = "GETBYIDS", ListOfIds = string.Join(",", new List<int>(ListOfIds).ToArray()) };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<DeviceInfo>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList(); 
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
