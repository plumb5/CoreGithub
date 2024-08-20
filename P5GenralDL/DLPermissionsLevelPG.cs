using Dapper;
using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLPermissionsLevelPG : CommonDataBaseInteraction, IDLPermissionsLevel
    {
        CommonInfo connection;
        public DLPermissionsLevelPG()
        {
            connection = GetDBConnection();
        }

        public DLPermissionsLevelPG(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<Int32> Save(PermissionsLevels permissionslevel)
        {
            string storeProcCommand = "select permissions_levels_save(@Name, @PermissionDescription, @IsSuperAdmin, @MainUserId, @_permissionsleveljson)";
            string _permissionsleveljson = JsonConvert.SerializeObject(permissionslevel);
            object? param = new { permissionslevel.Name, permissionslevel.PermissionDescription, permissionslevel.IsSuperAdmin, permissionslevel.MainUserId, _permissionsleveljson };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<bool> Update(PermissionsLevels permissionslevel)
        {
            string storeProcCommand = "select permissions_levels_update(@Id, @Name, @PermissionDescription, @IsSuperAdmin, @MainUserId, @_permissionsleveljson)";
            string _permissionsleveljson = JsonConvert.SerializeObject(permissionslevel);
            object? param = new { permissionslevel.Id, permissionslevel.Name, permissionslevel.PermissionDescription, permissionslevel.IsSuperAdmin, permissionslevel.MainUserId, _permissionsleveljson };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<int> GetMaxCount(int MainUserId, string? RoleName = null)
        {
            string storeProcCommand = "select permissions_levels_maxcount(@MainUserId)";
            object? param = new { MainUserId };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }
        public async Task<List<PermissionsLevels>> GetPermissionsList(int OffSet, int FetchNext, int MainUserId, string? RoleName = null)
        {
            string storeProcCommand = "select * from permissions_levels_get(@MainUserId, @RoleName, @FetchNext, @OffSet)";
            object? param = new { MainUserId, RoleName, FetchNext, OffSet };

            using var db = GetDbConnection();
            return (await db.QueryAsync<PermissionsLevels>(storeProcCommand, param)).ToList();
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select permissions_levels_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection();
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param) > 0;
        }

        public async Task<PermissionsLevels?> GetPermission(int PermissionId, int MainUserId)
        {
            string storeProcCommand = "select * from permissions_levels_getpermission(@PermissionId, @MainUserId)";
            object? param = new { PermissionId, MainUserId };

            using var db = GetDbConnection();
            return await db.QueryFirstOrDefaultAsync<PermissionsLevels?>(storeProcCommand, param);
        }

        public async Task<List<PermissionsLevels>> BindGroupsContact(MLUserGroup userGroup, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from permissions_levels_get(@OffSet, @FetchNext, @UserInfoUserId, @CreatedByUserId)";
            object? param = new { OffSet, FetchNext, userGroup.UserInfoUserId, userGroup.CreatedByUserId };

            using var db = GetDbConnection();
            return (await db.QueryAsync<PermissionsLevels>(storeProcCommand, param)).ToList();
        }

        public async Task<PermissionsLevels?> UserPermission(int UserInfoUserId)
        {
            string storeProcCommand = "select * from userspermission_userpermission(@UserInfoUserId)";
            object? param = new { UserInfoUserId };

            using var db = GetDbConnection();
            return await db.QueryFirstOrDefaultAsync<PermissionsLevels?>(storeProcCommand, param);
        }

        public async Task<PermissionsLevels?> UserPermissionbyAccountId(int UserInfoUserId, int AccountId)
        {
            string storeProcCommand = "select * from userspermission_userpermissionbyaccountid(@UserInfoUserId,@AccountId)";
            object? param = new { UserInfoUserId, AccountId };

            using var db = GetDbConnection();
            return await db.QueryFirstOrDefaultAsync<PermissionsLevels?>(storeProcCommand, param);
        }

        public async Task<List<PermissionsLevels>> GetRoles(int MainUserId)
        {
            string storeProcCommand = "select * from permissions_levels_getroles(@MainUserId)";
            object? param = new { MainUserId };

            using var db = GetDbConnection();
            return (await db.QueryAsync<PermissionsLevels>(storeProcCommand, param)).ToList();
        }

        public async Task<List<PermissionsLevels>> GetRolesByIds(List<int> PermissionLevelIds)
        {
            string storeProcCommand = "select * from permissions_levels_getrolesbyids(@PermissionLevelIds)";
            object? param = new { PermissionLevelIds = string.Join(",", PermissionLevelIds) };

            using var db = GetDbConnection();
            return (await db.QueryAsync<PermissionsLevels>(storeProcCommand, param)).ToList();
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
