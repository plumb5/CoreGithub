using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSpreadsheetsImporOverviewSQL : CommonDataBaseInteraction, IDLSpreadsheetsImporOverview
    {
        CommonInfo connection;
        public DLSpreadsheetsImporOverviewSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSpreadsheetsImporOverviewSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> MaxCount(int SpreadsheetsImportId)
        {
            string storeProcCommand = "Spreadsheets_ImporOverview";
            object? param = new { Action = "MaxCount", SpreadsheetsImportId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<List<SpreadsheetsImporOverview>> GetDetails(int SpreadsheetsImportId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "Spreadsheets_ImporOverview";
            object? param = new { Action = "Get", SpreadsheetsImportId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SpreadsheetsImporOverview>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<int> SaveResponse(int SpreadsheetsImportId, string ServerResponses, string ErrorMessage = null)
        {
            string storeProcCommand = "Spreadsheets_ImporOverview";
            object? param = new { Action="Save", SpreadsheetsImportId, ServerResponses, ErrorMessage };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
