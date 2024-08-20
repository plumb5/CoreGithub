using P5GenralML;
using IP5GenralDL;
using System.Data;
using System.Globalization;
using System.ComponentModel;
using DBInteraction;
using Dapper;
using Azure.Core;
using System;


namespace P5GenralDL
{
    public class DLApiUserGroupSQL : CommonDataBaseInteraction, IDLApiUserGroup
    {
        CommonInfo connection = null;
        public DLApiUserGroupSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLApiUserGroupSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int16> Save(int lastassignuserinfouserid, int usergroupid)
        {
            string storeProcCommand = "Apiuser_Group";
            object? param = new { Action = "Save", lastassignuserinfouserid, usergroupid };
            using var db = GetDbConnection(connection.Connection); 
            return Convert.ToInt16(await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure));

        }

        public async Task<ApiUserGroup?> GET(int usergroupid)
        {
            string storeProcCommand = "Apiuser_Group";
            object? param = new { Action = "GET", usergroupid };
            using var db = GetDbConnection(connection.Connection); 
            return await db.QueryFirstOrDefaultAsync<ApiUserGroup?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
