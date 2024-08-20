using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace P5GenralDL
{
    public class DLMobileInAppFormResponsesSQL : CommonDataBaseInteraction, IDLMobileInAppFormResponses
    {
        CommonInfo connection;
        public DLMobileInAppFormResponsesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileInAppFormResponsesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(MobileInAppFormResponses mobileInAppFormResponses)
        {
            string storeProcCommand = "MobileInApp_FormResponses";
            object? param = new { Action="Save", mobileInAppFormResponses.UserInfoUserId, mobileInAppFormResponses.UserGroupId, mobileInAppFormResponses.InAppCampaignId, mobileInAppFormResponses.InAppCampaignType, mobileInAppFormResponses.TrackIp, mobileInAppFormResponses.DeviceId, mobileInAppFormResponses.SessionId, mobileInAppFormResponses.ContactId, mobileInAppFormResponses.IsNew, mobileInAppFormResponses.ResponseDate, mobileInAppFormResponses.Referrer, mobileInAppFormResponses.Country, mobileInAppFormResponses.State, mobileInAppFormResponses.City, mobileInAppFormResponses.Field1, mobileInAppFormResponses.Field2, mobileInAppFormResponses.Field3, mobileInAppFormResponses.Field4, mobileInAppFormResponses.Field5, mobileInAppFormResponses.Field6, mobileInAppFormResponses.Field7, mobileInAppFormResponses.Field8, mobileInAppFormResponses.Field9, mobileInAppFormResponses.Field10, mobileInAppFormResponses.Field11, mobileInAppFormResponses.Field12, mobileInAppFormResponses.Field13, mobileInAppFormResponses.Field14, mobileInAppFormResponses.Field15, mobileInAppFormResponses.Field16, mobileInAppFormResponses.Field17, mobileInAppFormResponses.Field18, mobileInAppFormResponses.Field19, mobileInAppFormResponses.Field20, mobileInAppFormResponses.Field21, mobileInAppFormResponses.Field22, mobileInAppFormResponses.Field23, mobileInAppFormResponses.Field24, mobileInAppFormResponses.Field25, mobileInAppFormResponses.Field26, mobileInAppFormResponses.Field27, mobileInAppFormResponses.Field28, mobileInAppFormResponses.Field29, mobileInAppFormResponses.Field30, mobileInAppFormResponses.Field31, mobileInAppFormResponses.Field32, mobileInAppFormResponses.Field33, mobileInAppFormResponses.Field34, mobileInAppFormResponses.Field35, mobileInAppFormResponses.Field36, mobileInAppFormResponses.Field37, mobileInAppFormResponses.Field38, mobileInAppFormResponses.Field39, mobileInAppFormResponses.Field40 };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<MobileInAppFormResponses>> GetDetails(int OffSet, int FetchNext, DateTime? FromDate, DateTime? ToDate, int InAppCampaignId)
        {
            string storeProcCommand = "MobileInApp_FormResponses";
            object? param = new { Action = "GetList", FromDate, ToDate, OffSet, FetchNext, InAppCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppFormResponses>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<int> MaxCount(DateTime FromDateTime, DateTime ToDateTime, int InAppCampaignId)
        {
            string storeProcCommand = "MobileInApp_FormResponses";
            object? param = new { Action= "GetMaxCount", FromDateTime, ToDateTime, InAppCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> UpdateIsNew(int Id, bool isNew)
        {
            string storeProcCommand = "MobileInApp_FormResponses";
            object? param = new { Action = "UpdateNew", Id, isNew };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;

        }
        public async Task<Int32> SaveInappFormResponse(MobileInAppFormResponses mobileInAppFormResponses)
        {
            string storeProcCommand = "MobileInApp_FormResponses";
            object? param = new { Action= "SaveInappFormResponse", mobileInAppFormResponses.UserInfoUserId, mobileInAppFormResponses.UserGroupId, mobileInAppFormResponses.InAppCampaignId, mobileInAppFormResponses.InAppCampaignType, mobileInAppFormResponses.TrackIp, mobileInAppFormResponses.DeviceId, mobileInAppFormResponses.SessionId, mobileInAppFormResponses.ContactId, mobileInAppFormResponses.IsNew, mobileInAppFormResponses.Referrer, mobileInAppFormResponses.Country, mobileInAppFormResponses.State, mobileInAppFormResponses.City, mobileInAppFormResponses.Field1, mobileInAppFormResponses.Field2, mobileInAppFormResponses.Field3, mobileInAppFormResponses.Field4, mobileInAppFormResponses.Field5, mobileInAppFormResponses.Field6, mobileInAppFormResponses.Field7, mobileInAppFormResponses.Field8, mobileInAppFormResponses.Field9, mobileInAppFormResponses.Field10, mobileInAppFormResponses.Field11, mobileInAppFormResponses.Field12, mobileInAppFormResponses.Field13, mobileInAppFormResponses.Field14, mobileInAppFormResponses.Field15, mobileInAppFormResponses.Field16, mobileInAppFormResponses.Field17, mobileInAppFormResponses.Field18, mobileInAppFormResponses.Field19, mobileInAppFormResponses.Field20, mobileInAppFormResponses.Field21, mobileInAppFormResponses.Field22, mobileInAppFormResponses.Field23, mobileInAppFormResponses.Field24, mobileInAppFormResponses.Field25, mobileInAppFormResponses.Field26, mobileInAppFormResponses.Field27, mobileInAppFormResponses.Field28, mobileInAppFormResponses.Field29, mobileInAppFormResponses.Field30, mobileInAppFormResponses.Field31, mobileInAppFormResponses.Field32, mobileInAppFormResponses.Field33, mobileInAppFormResponses.Field34, mobileInAppFormResponses.Field35, mobileInAppFormResponses.Field36, mobileInAppFormResponses.Field37, mobileInAppFormResponses.Field38, mobileInAppFormResponses.Field39, mobileInAppFormResponses.Field40 };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
