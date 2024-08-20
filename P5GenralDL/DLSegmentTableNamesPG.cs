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
    public class DLSegmentTableNamesPG : CommonDataBaseInteraction, IDLSegmentTableNames
    {
        CommonInfo connection;

        public DLSegmentTableNamesPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSegmentTableNamesPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<SegmentTableNames>>GET()
        {
            string storeProcCommand = "select * from segment_tablenames_gettablenames()";
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SegmentTableNames>(storeProcCommand);
        }

        public async Task<IEnumerable<MLTableColumns>> GETCOLUMNS(string TableName)
        {
            string storeProcCommand = "select * from segment_tablenames_gettablecolumnnames(@TableName)";  
            object? param = new { TableName };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLTableColumns>(storeProcCommand, param);
        }
 

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {

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