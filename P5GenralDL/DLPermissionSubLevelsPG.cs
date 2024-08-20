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
    public class DLPermissionSubLevelsPG : CommonDataBaseInteraction, IDLPermissionSubLevels
    {
        CommonInfo connection;
        public DLPermissionSubLevelsPG()
        {
            connection = GetDBConnection();
        }

        public DLPermissionSubLevelsPG(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<long> Save(PermissionSubLevels subLevels)
        {
            string storeProcCommand = "select permission_sublevels_save(@PermissionLevelId, @AreaName, @ControllerName, @ActionName, @FeatureName, @HasPermission)";
            object? param = new { subLevels.PermissionLevelId, subLevels.AreaName, subLevels.ControllerName, subLevels.ActionName, subLevels.FeatureName, subLevels.HasPermission };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param);
        }

        public async Task<bool> Delete(long PermissionLevelId)
        {
            string storeProcCommand = "select permission_sublevels_delete(@PermissionLevelId)";
            object? param = new { PermissionLevelId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param) > 0;
        }

        public async Task<PermissionSubLevels?> GetDetails(PermissionSubLevels subLevels, string FeatureName)
        {
            string storeProcCommand = "select * from permission_sublevels_get(@PermissionLevelId, @FeatureName)";
            object? param = new { subLevels.PermissionLevelId, FeatureName };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<PermissionSubLevels?>(storeProcCommand, param);
        }

        public async Task<List<PermissionSubLevels>> GetAllDetails(PermissionSubLevels subLevels)
        {
            string storeProcCommand = "select * from permission_sublevels_get(@PermissionLevelId)";
            object? param = new { subLevels.PermissionLevelId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<PermissionSubLevels>(storeProcCommand, param)).ToList();
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
