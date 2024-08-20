using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSpreadsheetsImporOverviewPG : CommonDataBaseInteraction, IDLSpreadsheetsImporOverview
    {
        CommonInfo connection;
        public DLSpreadsheetsImporOverviewPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSpreadsheetsImporOverviewPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<int> MaxCount(int SpreadsheetsImportId)
        {
            string storeProcCommand = "select * from spreadsheets_imporoverview_maxcount(@SpreadsheetsImportId)";
            object? param = new { SpreadsheetsImportId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }
        public async Task<List<SpreadsheetsImporOverview>> GetDetails(int SpreadsheetsImportId, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from spreadsheets_imporoverview_get(@SpreadsheetsImportId, @OffSet, @FetchNext)";
            object? param = new { SpreadsheetsImportId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SpreadsheetsImporOverview>(storeProcCommand, param)).ToList();

        }

        public async Task<int> SaveResponse(int SpreadsheetsImportId, string ServerResponses, string ErrorMessage = null)
        {
            string storeProcCommand = "select * from spreadsheets_imporoverview_save(@MachineId,@Key)";
            object? param = new { SpreadsheetsImportId, ServerResponses, ErrorMessage };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);


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
