using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLMailUnSubscribeLinkPG : CommonDataBaseInteraction, IDLMailUnSubscribeLink
    {
        CommonInfo connection = null;
        public DLMailUnSubscribeLinkPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailUnSubscribeLinkPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<Groups>> GetGroupList(int ContactId)
        {
            string storeProcCommand = "select *  from groups_details(@ContactId)";
            object? param = new { ContactId };

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


