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
    public class DLContactAPIAssignedUserDetailsPG : CommonDataBaseInteraction, IDLContactAPIAssignedUserDetails
    {
        readonly CommonInfo connection;
        public DLContactAPIAssignedUserDetailsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public async Task<ContactAPIAssignedUserDetails?> Get()
        {
            string storeProcCommand = "select * from contactapiassigned_userdetails_get()"; 
            object? param = new { };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ContactAPIAssignedUserDetails?>(storeProcCommand, param);
        }
        public async Task<Int32> Save(ContactAPIAssignedUserDetails assignedUser)
        {
            string storeProcCommand = "select contactapiassigned_userdetails_save(@UserInfoUserId,@ContactId)";
            object? param = new {  assignedUser.UserInfoUserId, assignedUser.ContactId }; 
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) ;
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
