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
    public class DLMobileInAppFormResponsesPG : CommonDataBaseInteraction, IDLMobileInAppFormResponses
    {
        CommonInfo connection;
        public DLMobileInAppFormResponsesPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileInAppFormResponsesPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(MobileInAppFormResponses mobileInAppFormResponses)
        {
            string storeProcCommand = "select * from MobileInApp_FormResponses(@Action, @UserInfoUserId, @UserGroupId, @InAppCampaignId, @InAppCampaignType, @TrackIp, @DeviceId, @SessionId, @ContactId, @IsNew, @ResponseDate, @Referrer, @Country, @State, @City, @Field1, @Field2, @Field3, @Field4, @Field5, @Field6, @Field7, @Field8, @Field9, @Field10, @Field11, @Field12, @Field13, @Field14, @Field15, @Field16, @Field17, @Field18, @Field19, @Field20, @Field21, @Field22, @Field23, @Field24, @Field25, @Field26, @Field27, @Field28, @Field29, @Field30, @Field31, @Field32, @Field33, @Field34, @Field35, @Field36, @Field37, @Field38, @Field39, @Field40)";
            object? param = new { Action = "Save", mobileInAppFormResponses.UserInfoUserId, mobileInAppFormResponses.UserGroupId, mobileInAppFormResponses.InAppCampaignId, mobileInAppFormResponses.InAppCampaignType, mobileInAppFormResponses.TrackIp, mobileInAppFormResponses.DeviceId, mobileInAppFormResponses.SessionId, mobileInAppFormResponses.ContactId, mobileInAppFormResponses.IsNew, mobileInAppFormResponses.ResponseDate, mobileInAppFormResponses.Referrer, mobileInAppFormResponses.Country, mobileInAppFormResponses.State, mobileInAppFormResponses.City, mobileInAppFormResponses.Field1, mobileInAppFormResponses.Field2, mobileInAppFormResponses.Field3, mobileInAppFormResponses.Field4, mobileInAppFormResponses.Field5, mobileInAppFormResponses.Field6, mobileInAppFormResponses.Field7, mobileInAppFormResponses.Field8, mobileInAppFormResponses.Field9, mobileInAppFormResponses.Field10, mobileInAppFormResponses.Field11, mobileInAppFormResponses.Field12, mobileInAppFormResponses.Field13, mobileInAppFormResponses.Field14, mobileInAppFormResponses.Field15, mobileInAppFormResponses.Field16, mobileInAppFormResponses.Field17, mobileInAppFormResponses.Field18, mobileInAppFormResponses.Field19, mobileInAppFormResponses.Field20, mobileInAppFormResponses.Field21, mobileInAppFormResponses.Field22, mobileInAppFormResponses.Field23, mobileInAppFormResponses.Field24, mobileInAppFormResponses.Field25, mobileInAppFormResponses.Field26, mobileInAppFormResponses.Field27, mobileInAppFormResponses.Field28, mobileInAppFormResponses.Field29, mobileInAppFormResponses.Field30, mobileInAppFormResponses.Field31, mobileInAppFormResponses.Field32, mobileInAppFormResponses.Field33, mobileInAppFormResponses.Field34, mobileInAppFormResponses.Field35, mobileInAppFormResponses.Field36, mobileInAppFormResponses.Field37, mobileInAppFormResponses.Field38, mobileInAppFormResponses.Field39, mobileInAppFormResponses.Field40 };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);

        }

        public async Task<List<MobileInAppFormResponses>> GetDetails(int OffSet, int FetchNext, DateTime? FromDate, DateTime? ToDate, int InAppCampaignId)
        {
            string storeProcCommand = "select * from mobileinapp_formresponses_getlist(@FromDate, @ToDate,@ OffSet, @FetchNext, @InAppCampaignId )";
            object? param = new { FromDate, ToDate, OffSet, FetchNext, InAppCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppFormResponses>(storeProcCommand, param)).ToList();

        }

        public async Task<int> MaxCount(DateTime FromDateTime, DateTime ToDateTime, int InAppCampaignId)
        {
            string storeProcCommand = "select * from mobileinapp_formresponses_getmaxcount(@FromDateTime,@ToDateTime, @InAppCampaignId)";
            object? param = new { FromDateTime, ToDateTime, InAppCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<bool> UpdateIsNew(int Id, bool isNew)
        {
            string storeProcCommand = "select * from mobileinapp_formresponses_updatenew(@Id, @isNew)";
            object? param = new { Id, isNew };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
        public async Task<Int32> SaveInappFormResponse(MobileInAppFormResponses mobileInAppFormResponses)
        {
            string storeProcCommand = "select * from mobileinapp_formresponses_saveinappformresponse(@UserInfoUserId, @UserGroupId, @InAppCampaignId, @InAppCampaignType, @TrackIp, @DeviceId, @SessionId, @ContactId, @IsNew, @Referrer, @Country, @State, @City, @Field1, @Field2, @Field3, @Field4, @Field5, @Field6, @Field7, @Field8, @Field9, @Field10, @Field11, @Field12, @Field13, @Field14, @Field15, @Field16, @Field17, @Field18, @Field19, @Field20, @Field21, @Field22, @Field23, @Field24, @Field25, @Field26, @Field27, @Field28, @Field29, @Field30, @Field31, @Field32, @Field33, @Field34, @Field35, @Field36, @Field37, @Field38, @Field39, @Field40)";
            object? param = new { mobileInAppFormResponses.UserInfoUserId, mobileInAppFormResponses.UserGroupId, mobileInAppFormResponses.InAppCampaignId, mobileInAppFormResponses.InAppCampaignType, mobileInAppFormResponses.TrackIp, mobileInAppFormResponses.DeviceId, mobileInAppFormResponses.SessionId, mobileInAppFormResponses.ContactId, mobileInAppFormResponses.IsNew, mobileInAppFormResponses.Referrer, mobileInAppFormResponses.Country, mobileInAppFormResponses.State, mobileInAppFormResponses.City, mobileInAppFormResponses.Field1, mobileInAppFormResponses.Field2, mobileInAppFormResponses.Field3, mobileInAppFormResponses.Field4, mobileInAppFormResponses.Field5, mobileInAppFormResponses.Field6, mobileInAppFormResponses.Field7, mobileInAppFormResponses.Field8, mobileInAppFormResponses.Field9, mobileInAppFormResponses.Field10, mobileInAppFormResponses.Field11, mobileInAppFormResponses.Field12, mobileInAppFormResponses.Field13, mobileInAppFormResponses.Field14, mobileInAppFormResponses.Field15, mobileInAppFormResponses.Field16, mobileInAppFormResponses.Field17, mobileInAppFormResponses.Field18, mobileInAppFormResponses.Field19, mobileInAppFormResponses.Field20, mobileInAppFormResponses.Field21, mobileInAppFormResponses.Field22, mobileInAppFormResponses.Field23, mobileInAppFormResponses.Field24, mobileInAppFormResponses.Field25, mobileInAppFormResponses.Field26, mobileInAppFormResponses.Field27, mobileInAppFormResponses.Field28, mobileInAppFormResponses.Field29, mobileInAppFormResponses.Field30, mobileInAppFormResponses.Field31, mobileInAppFormResponses.Field32, mobileInAppFormResponses.Field33, mobileInAppFormResponses.Field34, mobileInAppFormResponses.Field35, mobileInAppFormResponses.Field36, mobileInAppFormResponses.Field37, mobileInAppFormResponses.Field38, mobileInAppFormResponses.Field39, mobileInAppFormResponses.Field40 };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

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