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
    public class DLEventTrackerPG : CommonDataBaseInteraction, IDLEventTracker
    {
        CommonInfo connection;
        public DLEventTrackerPG(int AccountId)
        {
            connection = GetDBConnection(AccountId);
        }

        public DLEventTrackerPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> SaveEventTrackingDetails(EventTracker mLEvent)
        {
            string storeProcCommand = "select event_tracker(@Name,@Events,@PageName,@VisitorIp,@MachineId,@SessionId,@EventValue)";
            object param = new { mLEvent.Name, mLEvent.Events, mLEvent.PageName, mLEvent.VisitorIp, mLEvent.MachineId, mLEvent.SessionId, mLEvent.EventValue };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
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
