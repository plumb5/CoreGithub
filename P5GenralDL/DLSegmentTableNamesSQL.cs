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
    public class DLSegmentTableNamesSQL : CommonDataBaseInteraction, IDLSegmentTableNames
    {
        CommonInfo connection;

        public DLSegmentTableNamesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSegmentTableNamesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<SegmentTableNames>> GET()
        {
            string storeProcCommand = "Segment_TableNames";
            object? param = new {Action= "GetTableNames"};
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<SegmentTableNames>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<MLTableColumns>> GETCOLUMNS(string TableName)
        {
            string storeProcCommand = "Segment_TableNames";
            object? param = new { Action = "GetTableColumnNames", TableName };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLTableColumns>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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