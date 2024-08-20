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
    public class DLSpreadsheetsImportDataPG : CommonDataBaseInteraction, IDLSpreadsheetsImportData
    {
        CommonInfo connection;
        public DLSpreadsheetsImportDataPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

         
        public async Task<Int32> Save(SpreadsheetsImportData spreadsheets)
        {
            string storeProcCommand = "select * from spreadsheets_importdata_save(@UserInfoUserId,@Name,@SpreadsheetId,@Range,@ImportType,@MappingFields,@APIResponseId,@ExecutingStatus,@Status,@ErrorMessage,@TimeZone,@LmsGroupId,@OverrideSources,@MappingLmscustomFields,@Dateformat)";
            object? param = new { spreadsheets.UserInfoUserId, spreadsheets.Name, spreadsheets.SpreadsheetId, spreadsheets.Range, spreadsheets.ImportType, spreadsheets.MappingFields, spreadsheets.APIResponseId, spreadsheets.ExecutingStatus, spreadsheets.Status, spreadsheets.ErrorMessage, spreadsheets.TimeZone, spreadsheets.LmsGroupId, spreadsheets.OverrideSources, spreadsheets.MappingLmscustomFields, spreadsheets.Dateformat };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<bool> Update(SpreadsheetsImportData spreadsheets)
        {
            string storeProcCommand = "select * from spreadsheets_importdata_update( @Id, @UserInfoUserId, @Name, @SpreadsheetId, @Range, @ImportType, @MappingFields, @APIResponseId, @ExecutingStatus, @Status, @ErrorMessage, @TimeZone, @LmsGroupId, @OverrideSources, @MappingLmscustomFields, @Dateformat)";
            object? param = new { spreadsheets.Id, spreadsheets.UserInfoUserId, spreadsheets.Name, spreadsheets.SpreadsheetId, spreadsheets.Range, spreadsheets.ImportType, spreadsheets.MappingFields, spreadsheets.APIResponseId, spreadsheets.ExecutingStatus, spreadsheets.Status, spreadsheets.ErrorMessage, spreadsheets.TimeZone, spreadsheets.LmsGroupId, spreadsheets.OverrideSources, spreadsheets.MappingLmscustomFields, spreadsheets.Dateformat };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<List<SpreadsheetsImportData>> GetRunningLiveDetails()
        {
            string storeProcCommand = "select * from spreadsheets_importdata_getrunninglivedetails()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SpreadsheetsImportData>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> UpdateError(SpreadsheetsImportData spreadsheets)
        {
            string storeProcCommand = "select * from spreadsheets_importdata_updateerror(@Id, @ExecutingStatus, @ErrorMessage)";
            object? param = new { spreadsheets.Id, spreadsheets.ExecutingStatus, spreadsheets.ErrorMessage };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> UpdateLastExecutedDate(SpreadsheetsImportData spreadsheets)
        {
            string storeProcCommand = "select * from spreadsheets_importdata_updatelastexecuteddate(@Id,@LastExecutedDateTime)";
            object? param = new { spreadsheets.Id, spreadsheets.LastExecutedDateTime };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
        public async Task<List<SpreadsheetsImportData>> GetLiveSheetDetails(string ImportType)
        {
            string storeProcCommand = "select * from spreadsheets_importdata_getlivesheetdetails(@ImportType)";
            object? param = new { ImportType };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SpreadsheetsImportData>(storeProcCommand, param)).ToList();

        }
        public async Task<bool> DeleteSpreadSheetRealTimeData(int Id)
        {
            string storeProcCommand = "select * from spreadsheets_importdata_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
        public async Task<int> ChangeStatusofRealTime(int Id)
        {
            string storeProcCommand = "select * from spreadsheets_importdata_changestatus(@Id)";
            object? param = new { Id };

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
