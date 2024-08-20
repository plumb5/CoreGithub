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
    public class DLContactAPIAssignedUserDetailsSQL : CommonDataBaseInteraction, IDLContactAPIAssignedUserDetails
    {
        readonly CommonInfo connection;
        public DLContactAPIAssignedUserDetailsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public async Task<ContactAPIAssignedUserDetails?> Get()
        {
            string storeProcCommand = "ContactAPIAssigned_UserDetails";
            object? param = new {Action="Get" };
            using var db = GetDbConnection(connection.Connection); 
            return await db.QueryFirstOrDefaultAsync<ContactAPIAssignedUserDetails?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<Int32> Save(ContactAPIAssignedUserDetails assignedUser)
        {
            string storeProcCommand = "ContactAPIAssigned_UserDetails";
            object? param = new { Action = "Save" ,assignedUser.UserInfoUserId, assignedUser.ContactId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
