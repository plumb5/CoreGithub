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
    public class DLAdminUserDetailsPG : CommonDataBaseInteraction, IDLAdminUserDetails
    {
        CommonInfo connection;
        public DLAdminUserDetailsPG()
        {
            connection = GetDBConnection();
        }
        public async Task<IEnumerable<MLAdminUserInfo>> GetAllUser(string UserIdList=null)
        {
            string storeProcCommand = "select * from admin_userdetails_getalluser(@UserIdList)";
            object? param = new { UserIdList };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLAdminUserInfo>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MLAdminUserInfo>> SelectAllUsers()
        {
            string storeProcCommand = "select * from admin_userdetails_selectallusers()";

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLAdminUserInfo>(storeProcCommand);
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
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
