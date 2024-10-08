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
    public class DLLmsContactImportOverviewSQL : CommonDataBaseInteraction, IDLLmsContactImportOverview
    {
        CommonInfo connection;
        public DLLmsContactImportOverviewSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsContactImportOverviewSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(LmsContactImportOverview contactImportOverview)
        {
            string storeProcCommand = "LmsContact_ImportOverview";
            object? param = new { Action = "Save", contactImportOverview.UserInfoUserId, contactImportOverview.LmsGroupId, contactImportOverview.UserGroupId, contactImportOverview.ContactFileName, contactImportOverview.SuccessCount, contactImportOverview.RejectedCount, contactImportOverview.MergeCount, contactImportOverview.IsCompleted, contactImportOverview.ErrorMessage, contactImportOverview.ImportedFileName, contactImportOverview.TotalInputRow, contactImportOverview.TotalCompletedRow, contactImportOverview.AssignUserInfoUserId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> Update(LmsContactImportOverview contactImportOverview)
        {
            string storeProcCommand = "LmsContact_ImportOverview";
            object? param = new { Action = "Update", contactImportOverview.Id, contactImportOverview.SuccessCount, contactImportOverview.RejectedCount, contactImportOverview.MergeCount, contactImportOverview.ErrorMessage, contactImportOverview.IsCompleted, contactImportOverview.TotalInputRow, contactImportOverview.TotalCompletedRow };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;

        }

        public async Task<LmsContactImportOverview?> Get(LmsContactImportOverview contactImportOverview)
        {
            string storeProcCommand = "LmsContact_ImportOverview";
            object? param = new { Action = "Get", contactImportOverview.Id, contactImportOverview.UserInfoUserId, contactImportOverview.LmsGroupId, contactImportOverview.IsCompleted };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<LmsContactImportOverview>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<LmsContactImportOverview>> GetList(LmsContactImportOverview contactImportOverview, DateTime? FromDateTime, DateTime? ToDateTime)
        {
            string storeProcCommand = "LmsContact_ImportOverview";
            object? param = new { Action = "GetList", contactImportOverview.Id, contactImportOverview.UserInfoUserId, contactImportOverview.LmsGroupId, contactImportOverview.IsCompleted, FromDateTime, ToDateTime };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsContactImportOverview>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<List<LmsContactImportOverview>> GetDetailsToImport()
        {
            string storeProcCommand = "LmsContact_ImportOverview";
            object? param = new { Action = "GetDetailsToImport"};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsContactImportOverview>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<List<LmsContactImportOverview>> GetAllDetails(int OffSet, int FetchNext)
        {
            string storeProcCommand = "LmsContact_ImportOverview";
            object? param = new { Action = "GetAllDetails", OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<LmsContactImportOverview>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<int> GetAllDetailsMaxCount()
        {
            string storeProcCommand = "LmsContact_ImportOverview";
            object? param = new { Action = "GetAllDetailsCount" };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
    }
}
