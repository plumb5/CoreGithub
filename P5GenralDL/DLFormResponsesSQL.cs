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
    public class DLFormResponsesSQL : CommonDataBaseInteraction, IDLFormResponses
    {
        CommonInfo connection = null;
        public DLFormResponsesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFormResponsesSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(FormResponses formResponses)
        {
            string storeProcCommand = "Form_Responses";
            object? param = new {Action="Save", formResponses.FormId, formResponses.UserInfoUserId, formResponses.UserGroupId, formResponses.TrackIp, formResponses.MachineId, formResponses.SessionRefer, formResponses.ContactId, formResponses.SearchKeyword, formResponses.Referrer, formResponses.IsAdSenseOrAdWord, formResponses.Country, formResponses.StateName, formResponses.City, formResponses.PageUrl, formResponses.Field1, formResponses.Field2, formResponses.Field3, formResponses.Field4, formResponses.Field5, formResponses.Field6, formResponses.Field7, formResponses.Field8, formResponses.Field9, formResponses.Field10, formResponses.Field11, formResponses.Field12, formResponses.Field13, formResponses.Field14, formResponses.Field15, formResponses.Field16, formResponses.Field17, formResponses.Field18, formResponses.Field19, formResponses.Field20, formResponses.UtmTagSource, formResponses.MailSubscribe, formResponses.MailOverallSubscribe, formResponses.SmsSubscribe, formResponses.SmsOverallSubscribe, formResponses.UtmMedium, formResponses.UtmCampaign, formResponses.UtmTerm, formResponses.UtmContent, formResponses.Project, formResponses.ProjectDate, formResponses.Field21, formResponses.Field22, formResponses.Field23, formResponses.Field24, formResponses.Field25, formResponses.Field26, formResponses.Field27, formResponses.Field28, formResponses.Field29, formResponses.Field30, formResponses.Field31, formResponses.Field32, formResponses.Field33, formResponses.Field34, formResponses.Field35, formResponses.Field36, formResponses.Field37, formResponses.Field38, formResponses.Field39, formResponses.Field40, formResponses.ResponsedDevice, formResponses.ResponsedDeviceType, formResponses.ResponsedUserAgent };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(int Id)
        {
            string storeProcCommand = "Form_Responses";
            object? param = new { Action = "UpdateLeadSeen", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
        }

        public async Task<IEnumerable<FormResponses>> GetDetails(FormResponses formResponses, int OFFSET, int FETCH, DateTime? TrackFromDate, DateTime? TrackToDate, List<string> fieldName = null, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null)
        {
            string fieldNames = fieldName != null ? string.Join(",", fieldName.ToArray()) : null;
            string storeProcCommand = "Form_Responses";
            object? param = new { Action = "GET", formResponses.FormId, formResponses.UserInfoUserId, formResponses.UserGroupId, formResponses.TrackIp, formResponses.MachineId, formResponses.SessionRefer, formResponses.ContactId, formResponses.SearchKeyword, formResponses.Referrer, formResponses.IsAdSenseOrAdWord, formResponses.Country, formResponses.StateName, formResponses.City, formResponses.PageUrl, formResponses.Field1, formResponses.Field2, formResponses.Field3, formResponses.Field4, formResponses.Field5, formResponses.Field6, formResponses.Field7, formResponses.Field8, formResponses.Field9, formResponses.Field10, OFFSET, FETCH, TrackFromDate, TrackToDate, fieldNames, formResponses.Field11, formResponses.Field12, formResponses.Field13, formResponses.Field14, formResponses.Field15, formResponses.Field16, formResponses.Field17, formResponses.Field18, formResponses.Field19, formResponses.Field20, formResponses.UtmTagSource, formResponses.UtmMedium, formResponses.UtmCampaign, formResponses.UtmTerm, formResponses.UtmContent, formResponses.MailSubscribe, formResponses.MailOverallSubscribe, formResponses.SmsSubscribe, formResponses.SmsOverallSubscribe, formResponses.Field21, formResponses.Field22, formResponses.Field23, formResponses.Field24, formResponses.Field25, formResponses.Field26, formResponses.Field27, formResponses.Field28, formResponses.Field29, formResponses.Field30, formResponses.Field31, formResponses.Field32, formResponses.Field33, formResponses.Field34, formResponses.Field35, formResponses.Field36, formResponses.Field37, formResponses.Field38, formResponses.Field39, formResponses.Field40, UserInfoUserIdList, IsSuperAdmin };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<FormResponses>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<string>> GetIpAddress()
        {
            string storeProcCommand = "Form_Responses";
            object? param = new { Action = "GetIpAddress" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<string>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }



        public async Task<Int32> MaxCount(DateTime FromDateTime, DateTime ToDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm, int UserInfoUserId = 0, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null, int? VisitorType = null)
        {
            string UserInfoUserIdLists = UserInfoUserIdList != null ? string.Join(",", UserInfoUserIdList) : null;
            string storeProcCommand = "Form_Responses";
            object? param = new { Action = "MaxCount", FromDateTime, ToDateTime, EmbeddedFormOrPopUpFormOrTaggedForm, UserInfoUserId, UserInfoUserIdLists, IsSuperAdmin, VisitorType };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<IEnumerable<MLFormResponseWithFormDetails>> FormResponseDetails(int FormId, int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime, string EmbeddedFormOrPopUpFormOrTaggedForm, int UserInfoUserId = 0, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null, int? VisitorType = null)
        {
            string UserInfoUserIdLists = UserInfoUserIdList != null ? string.Join(",", UserInfoUserIdList) : null;
            string storeProcCommand = "Form_Responses";
            object? param = new { Action = "AllResponseData", FormId, OffSet, FetchNext, FromDateTime, ToDateTime, EmbeddedFormOrPopUpFormOrTaggedForm, UserInfoUserId, UserInfoUserIdLists, IsSuperAdmin, VisitorType };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLFormResponseWithFormDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }


        public async Task<Int32> GetCustomMaxCount(FormResponses formResponses, string StartDate, string EndDate, string EmbeddedFormOrPopUpFormOrTaggedForm, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null)
        {
            string storeProcCommand = "Forms_Pg_ResponsesCustomReport";
            object? param = new { Action = "GetDataMaxCount", formResponses.UserInfoUserId, formResponses.FormId, formResponses.TrackIp, formResponses.Field1, formResponses.PageUrl, formResponses.SearchKeyword, formResponses.Referrer, formResponses.IsAdSenseOrAdWord, StartDate, EndDate, formResponses.UtmTagSource, formResponses.UtmMedium, formResponses.UtmCampaign, formResponses.UtmTerm, formResponses.UtmContent, formResponses.MailSubscribe, formResponses.MailOverallSubscribe, formResponses.SmsSubscribe, formResponses.SmsOverallSubscribe, UserInfoUserIdList, IsSuperAdmin, EmbeddedFormOrPopUpFormOrTaggedForm };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }


        public async Task<IEnumerable<MLFormResponseWithFormDetails>> GetCustomResponses(FormResponses formResponses, int OffSet, int FetchNext, string StartDate, string EndDate, string EmbeddedFormOrPopUpFormOrTaggedForm, List<int> UserInfoUserIdList = null, int? IsSuperAdmin = null)
        {
            string storeProcCommand = "Forms_Pg_ResponsesCustomReport";
            object? param = new { Action = "GetSearchData", formResponses.UserInfoUserId, formResponses.FormId, formResponses.TrackIp, formResponses.Field1, formResponses.PageUrl, formResponses.SearchKeyword, formResponses.Referrer, formResponses.IsAdSenseOrAdWord, OffSet, FetchNext, StartDate, EndDate, formResponses.UtmTagSource, formResponses.UtmMedium, formResponses.UtmCampaign, formResponses.UtmTerm, formResponses.UtmContent, formResponses.MailSubscribe, formResponses.MailOverallSubscribe, formResponses.SmsSubscribe, formResponses.SmsOverallSubscribe, UserInfoUserIdList, IsSuperAdmin, EmbeddedFormOrPopUpFormOrTaggedForm };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLFormResponseWithFormDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<DataSet> GetCustomisedFormReponseDetails(FormResponses formResponses, string StartDate, string EndDate)
        {
            string storeProcCommand = "Forms_Pg_ResponsesCustomReport";
            object? param = new { Action = "GetCustomisedFormResponseData", formResponses.FormId, formResponses.TrackIp, formResponses.Field1, formResponses.PageUrl, formResponses.SearchKeyword, formResponses.Referrer, formResponses.IsAdSenseOrAdWord, StartDate, EndDate, formResponses.UtmTagSource, formResponses.UtmMedium, formResponses.UtmCampaign, formResponses.UtmTerm, formResponses.UtmContent, formResponses.MailSubscribe, formResponses.MailOverallSubscribe, formResponses.SmsSubscribe, formResponses.SmsOverallSubscribe };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> FilterDataBySourceCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Form_Responses";
            object? param = new { Action = "FilterDataBySourceCount", FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> FilterDataByCityCount(DateTime FromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "Form_Responses"; 
            object? param = new { Action = "FilterDataByCityCount", FromDateTime, ToDateTime };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetFormRespondedNameByContactId(int? ContactId = null)
        {
            string storeProcCommand = "Form_Responses"; 
            object? param = new { Action = "FormRespondedNamesByContactId", ContactId };
            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        public async Task<Int32> LeadsResponseCount(string Duration, DateTime FromDate, DateTime ToDate)
        {
            string storeProcCommand = "Forms_Pg_ResponsesCustomReport"; 
            object? param = new { Action = "LeadsResponseCount", Duration, FromDate, ToDate };

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
