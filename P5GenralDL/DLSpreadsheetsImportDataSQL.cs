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
    public class DLSpreadsheetsImportDataSQL : CommonDataBaseInteraction, IDLSpreadsheetsImportData
    {
        CommonInfo connection;
        public DLSpreadsheetsImportDataSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSpreadsheetsImportDataSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<Int32> Save(SpreadsheetsImportData spreadsheets)
        {
            string storeProcCommand = "Spreadsheets_ImportData";
            object? param = new {Action="Save",spreadsheets.UserInfoUserId, spreadsheets.Name, spreadsheets.SpreadsheetId, spreadsheets.Range, spreadsheets.ImportType, spreadsheets.MappingFields, spreadsheets.APIResponseId, spreadsheets.ExecutingStatus, spreadsheets.Status, spreadsheets.ErrorMessage, spreadsheets.TimeZone, spreadsheets.LmsGroupId, spreadsheets.OverrideSources, spreadsheets.MappingLmscustomFields, spreadsheets.Dateformat };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Update(SpreadsheetsImportData spreadsheets)
        {
            string storeProcCommand = "Spreadsheets_ImportData";
            object? param = new { Action = "Update", spreadsheets.Id, spreadsheets.UserInfoUserId, spreadsheets.Name, spreadsheets.SpreadsheetId, spreadsheets.Range, spreadsheets.ImportType, spreadsheets.MappingFields, spreadsheets.APIResponseId, spreadsheets.ExecutingStatus, spreadsheets.Status, spreadsheets.ErrorMessage, spreadsheets.TimeZone, spreadsheets.LmsGroupId, spreadsheets.OverrideSources, spreadsheets.MappingLmscustomFields, spreadsheets.Dateformat };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;

        }
        //public async Task<Int32> Save(SpreadsheetsImportData spreadsheets )
        //{
        //    string storeProcCommand = "Spreadsheets_ImportData";
        //    object? param = new { Action="Save",spreadsheets.UserInfoUserId, spreadsheets.Name, spreadsheets.SpreadsheetId, spreadsheets.Range, spreadsheets.ImportType, spreadsheets.MappingFields, spreadsheets.APIResponseId, spreadsheets.ExecutingStatus, spreadsheets.Status, spreadsheets.ErrorMessage, spreadsheets.TimeZone,  spreadsheets.LmsGroupId, spreadsheets.OverrideSources };

        //    using var db = GetDbConnection(connection.Connection);
        //    return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        //}

        public async Task<List<SpreadsheetsImportData>> GetRunningLiveDetails()
        {
            string storeProcCommand = "Spreadsheets_ImportData";
            object? param = new { Action = "GetRunningLiveDetails"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SpreadsheetsImportData>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<bool> UpdateError(SpreadsheetsImportData spreadsheets)
        {
            string storeProcCommand = "Spreadsheets_ImportData";
            object? param = new { Action = "UpdateError", spreadsheets.Id, spreadsheets.ExecutingStatus, spreadsheets.ErrorMessage };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }

        public async Task<bool> UpdateLastExecutedDate(SpreadsheetsImportData spreadsheets)
        {
            string storeProcCommand = "Spreadsheets_ImportData";
            object? param = new { Action = "UpdateLastExecutedDate", spreadsheets.Id, spreadsheets.LastExecutedDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
        public async Task<List<SpreadsheetsImportData>> GetLiveSheetDetails(string ImportType)
        {
            string storeProcCommand = "Spreadsheets_ImportData";
            object? param = new { Action = "GetLiveSheetDetails", ImportType };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SpreadsheetsImportData>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<bool> DeleteSpreadSheetRealTimeData(int Id)
        {
            string storeProcCommand = "Spreadsheets_ImportData";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public async Task<int> ChangeStatusofRealTime(int Id)
        {
            string storeProcCommand = "Spreadsheets_ImportData";
            object? param = new { Action= "ChangeStatus", Id };

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
