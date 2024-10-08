﻿using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;

namespace P5GenralDL
{
    public class DLAdminWebLoggerSQL : CommonDataBaseInteraction, IDLAdminWebLogger
    {
        CommonInfo connection;
        public DLAdminWebLoggerSQL()
        {
            connection = GetDBConnection();
        }
        public async Task<long> SaveLog(AdminWebLogger logDetails)
        {
            string storeProcCommand = "AdminWeb_Logger";
            object? param = new { Action = "Save" };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<long>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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

