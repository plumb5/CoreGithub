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
    public class DLAdminUserAccountsPG : CommonDataBaseInteraction, IDLAdminUserAccounts
    {
        CommonInfo connection;
        public DLAdminUserAccountsPG()
        {
            connection = GetDBConnection();
        }

        public async Task<List<AdminUserAccounts>> GetDetails(List<int> Users)
        {
            string storeProcCommand = "select * from admin_getuseraccountdetails_getdetails(@Users)";
            object? param = new { Users = string.Join(",", new List<int>(Users).ToArray()) };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<AdminUserAccounts>(storeProcCommand, param)).ToList();
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

