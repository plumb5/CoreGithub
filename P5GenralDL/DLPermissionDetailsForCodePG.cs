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
    public class DLPermissionDetailsForCodePG : CommonDataBaseInteraction, IDLPermissionDetailsForCode
    {
        CommonInfo connection;

        public DLPermissionDetailsForCodePG()
        {
            connection = GetDBConnection();
        }

        public DLPermissionDetailsForCodePG(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<IEnumerable<PermissionDetailsForCode>> Get()
        {
            string storeProcCommand = "select * from permission_detailsforcode_details_getdetails()"; 
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<PermissionDetailsForCode>(storeProcCommand);
        }

        public async Task<Int32> SaveDetails(PermissionDetailsForCode purchase)
        {
            string storeProcCommand = "select permission_detailsforcode_details_save(@AreaName, @ControllerName, @ActionName)"; 
            object? param = new { purchase.AreaName, purchase.ControllerName, purchase.ActionName };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
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
 
