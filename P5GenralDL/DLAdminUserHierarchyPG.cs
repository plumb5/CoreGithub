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
    public class DLAdminUserHierarchyPG : CommonDataBaseInteraction, IDLAdminUserHierarchy
    {
        CommonInfo connection;
        public DLAdminUserHierarchyPG()
        {
            connection = GetDBConnection();
        }
        public async Task<IEnumerable<MLAdminUserHierarchy>> GetHisUsers(int UserId)
        {
            string storeProcCommand = "select * from admin_user_hierarchy_gethisusers(@UserId)";
            object? param = new { UserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLAdminUserHierarchy>(storeProcCommand, param);
        }
        public async Task<MLAdminUserHierarchy?> GetHisDetails(int UserInfoUserId)
        {
            string storeProcCommand = "select * from admin_user_hierarchy_gethisdetails(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLAdminUserHierarchy?>(storeProcCommand, param);
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
