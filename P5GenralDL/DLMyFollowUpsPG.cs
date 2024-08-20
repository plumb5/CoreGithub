using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;

namespace P5GenralDL
{
    public class DLMyFollowUpsPG : CommonDataBaseInteraction, IDLMyFollowUps
    {
        CommonInfo connection = null;
        public DLMyFollowUpsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLMyFollowUpsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<Contact>> GetFollowUpNotification(string UserIdList, DateTime StartDate, DateTime EndDate)
        {
            string storeProcCommand = "select * from my_followups_getfollowupnotification(@UserIdList, @StartDate, @EndDate)";
            object? param = new { UserIdList, StartDate, EndDate };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Contact>(storeProcCommand, param)).ToList();
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



