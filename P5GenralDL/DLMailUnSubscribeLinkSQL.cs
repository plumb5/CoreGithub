using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLMailUnSubscribeLinkSQL : CommonDataBaseInteraction, IDLMailUnSubscribeLink
    {
        CommonInfo connection = null;
        public DLMailUnSubscribeLinkSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailUnSubscribeLinkSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<Groups>> GetGroupList(int ContactId)
        {
            string storeProcCommand = "Groups_Details";
            object? param = new { @Action = "GetGroupsByMember", ContactId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Groups>(storeProcCommand, param)).ToList();
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



