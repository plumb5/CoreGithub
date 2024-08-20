using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLPermissionSubLevelsSQL : CommonDataBaseInteraction, IDLPermissionSubLevels
    {
        CommonInfo connection;
        public DLPermissionSubLevelsSQL()
        {
            connection = GetDBConnection();
        }

        public DLPermissionSubLevelsSQL(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<long> Save(PermissionSubLevels subLevels)
        {
            string storeProcCommand = "Permission_SubLevels";
            object? param = new { Action = "Save", subLevels.PermissionLevelId, subLevels.AreaName, subLevels.ControllerName, subLevels.ActionName, subLevels.FeatureName, subLevels.HasPermission };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(long PermissionLevelId)
        {
            string storeProcCommand = "Permission_SubLevels";
            object? param = new { Action = "Delete", PermissionLevelId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<PermissionSubLevels?> GetDetails(PermissionSubLevels subLevels, string FeatureName)
        {
            string storeProcCommand = "Permission_SubLevels";
            object? param = new { Action = "GET", subLevels.PermissionLevelId, FeatureName };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<PermissionSubLevels?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<PermissionSubLevels>> GetAllDetails(PermissionSubLevels subLevels)
        {
            string storeProcCommand = "Permission_SubLevels";
            object? param = new { Action = "GetAll", subLevels.PermissionLevelId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<PermissionSubLevels>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
                    connection = null;
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
