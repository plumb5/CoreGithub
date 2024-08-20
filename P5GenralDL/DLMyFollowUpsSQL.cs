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
    public class DLMyFollowUpsSQL : CommonDataBaseInteraction, IDLMyFollowUps
    {
        CommonInfo connection = null;
        public DLMyFollowUpsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLMyFollowUpsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<Contact>> GetFollowUpNotification(string UserIdList, DateTime StartDate, DateTime EndDate)
        {
            string storeProcCommand = "My_FollowUps";
            object? param = new { @Action = "GetFollowUpNotification", UserIdList, StartDate, EndDate };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Contact>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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


