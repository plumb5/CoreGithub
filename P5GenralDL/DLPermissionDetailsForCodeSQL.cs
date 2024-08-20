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
    public class DLPermissionDetailsForCodeSQL : CommonDataBaseInteraction, IDLPermissionDetailsForCode
    {
        CommonInfo connection;

        public DLPermissionDetailsForCodeSQL()
        {
            connection = GetDBConnection();
        }

        public DLPermissionDetailsForCodeSQL(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<IEnumerable<PermissionDetailsForCode>> Get()
        {
            string storeProcCommand = "Permission_DetailsForCode";
            object? param = new { Action="Get" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<PermissionDetailsForCode>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<Int32> SaveDetails(PermissionDetailsForCode purchase)
        {
            string storeProcCommand = "Permission_DetailsForCode";
            object? param = new { Action = "Save", purchase.AreaName, purchase.ControllerName, purchase.ActionName };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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