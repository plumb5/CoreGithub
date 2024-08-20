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
    public class DLMainScriptSQL : CommonDataBaseInteraction, IDLMainScript
    {
        CommonInfo connection;
        public DLMainScriptSQL()
        {
            connection = GetDBConnection();
        }

        public DLMainScriptSQL(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<MainScript?> GetScriptBasedOnFileName(string FileName)
        {
            string storeProcCommand = "Plumb_Scripts";
            object? param = new { Action= "GetScriptBasedOnFileName", FileName };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MainScript?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);


        }

        public async Task<Int32> InsertScript(MainScript mainScript)
        {
            string storeProcCommand = "Plumb_Scripts";
            object? param = new { Action = "InsertScript", mainScript.UserInfoUserId, mainScript.FileName, mainScript.FileDescription, mainScript.FileType, mainScript.Script };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 

        }

        public async Task<IEnumerable<MainScript>> GetScripts()
        {
            string storeProcCommand = "Plumb_Scripts";
            object? param = new
            {
                Action = "GetAllScripts"
            };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MainScript>(storeProcCommand, param, commandType: CommandType.StoredProcedure);  
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
