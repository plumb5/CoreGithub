﻿using Dapper;
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
    public class DLGoogleAdWordsImportDataSQL : CommonDataBaseInteraction, IDLGoogleAdWordsImportData
    {
        CommonInfo connection = null;
        public DLGoogleAdWordsImportDataSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGoogleAdWordsImportDataSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public async Task<GoogleAdWordsImportData?> GetDetailsAsync(int Id)
        {
            string storeProcCommand = "Google_AdWordsImportData";
            object? param = new {Action= "Get", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<GoogleAdWordsImportData>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<Int32> Save(GoogleAdWordsImportData GoogleAdwords)
        {
            string storeProcCommand = "Google_AdWordsImportData";
            object? param = new { Action = "Save", GoogleAdwords.UserInfoUserId, GoogleAdwords.Name, GoogleAdwords.MappingFields, GoogleAdwords.APIResponseId, GoogleAdwords.Status, GoogleAdwords.ErrorMessage, GoogleAdwords.TimeZone, GoogleAdwords.LmsGroupId, GoogleAdwords.OverrideSources, GoogleAdwords.MappingLmscustomFields };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Update(GoogleAdWordsImportData GoogleAdwords)
        {
            string storeProcCommand = "Google_AdWordsImportData";
            object? param = new { Action = "Update", GoogleAdwords.Id, GoogleAdwords.UserInfoUserId, GoogleAdwords.Name, GoogleAdwords.MappingFields, GoogleAdwords.APIResponseId, GoogleAdwords.Status, GoogleAdwords.ErrorMessage, GoogleAdwords.TimeZone, GoogleAdwords.LmsGroupId, GoogleAdwords.OverrideSources, GoogleAdwords.MappingLmscustomFields };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public async Task<List<GoogleAdWordsImportData>> GetDetails()
        {
            string storeProcCommand = "Google_AdWordsImportData";
            object? param = new { Action = "Get", Id = 0 };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GoogleAdWordsImportData>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<int> ChangeStatusadwords(int Id)
        {
            string storeProcCommand = "Google_AdWordsImportData";
            object? param = new { Action = "ChangeStatus", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<bool> DeleteadwordsData(int Id)
        {
            string storeProcCommand = "Google_AdWordsImportData";
            object? param = new { Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

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
