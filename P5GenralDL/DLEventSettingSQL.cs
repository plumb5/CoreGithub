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
    public class DLEventSettingSQL : CommonDataBaseInteraction, IDLEventSetting
    {
        CommonInfo connection;
        public DLEventSettingSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLEventSettingSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<List<EventSetting>> GET(string EventName)
        {
            string storeProcCommand = "Event_Setting";
            object? param = new { Action = "GET", EventName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<EventSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public Task<List<EventSetting>> GetEventTrackingDetails()
        {
            throw new NotImplementedException();
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
