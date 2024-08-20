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
    public class DLMainScriptPG : CommonDataBaseInteraction, IDLMainScript
    {
        CommonInfo connection;
        public DLMainScriptPG()
        {
            connection = GetDBConnection();
        }

        public DLMainScriptPG(string ConnectionStrings)
        {
            connection = new CommonInfo { Connection = ConnectionStrings };
        }

        public async Task<MainScript?>  GetScriptBasedOnFileName(string FileName)
        {
            string storeProcCommand = "select * from plumb_scripts_getscriptbasedonfilename(@FileName)"; 
            object? param = new { FileName };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MainScript?>(storeProcCommand, param);

        }

        public async Task<Int32> InsertScript(MainScript mainScript)
        {
            string storeProcCommand = "select * from plumb_scripts_insertscript(@UserInfoUserId, @FileName, @FileDescription, @FileType, @Script)"; 
            object? param = new { mainScript.UserInfoUserId, mainScript.FileName, mainScript.FileDescription, mainScript.FileType, mainScript.Script };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param); 
        }

        public async Task<IEnumerable<MainScript>> GetScripts()
        {
            string storeProcCommand = "select * from plumb_scripts_getallscripts()";
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MainScript>(storeProcCommand);
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
