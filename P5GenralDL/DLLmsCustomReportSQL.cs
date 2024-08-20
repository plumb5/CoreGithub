using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace P5GenralDL
{
    public class DLLmsCustomReportSQL : CommonDataBaseInteraction, IDLLmsCustomReport
    {
        CommonInfo connection;
        public DLLmsCustomReportSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsCustomReportSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> GetMaxCount(LmsCustomReport filterLead, int publishertype = 0)
        {
            string storeProcCommand = "Lms_CustomReport";
            object? param = new { Action = "MaxCount",
                filterLead.OrderBy,
                filterLead.StartDate,
                filterLead.EndDate,
                filterLead.Score,
                filterLead.LmsGroupIdList,
                filterLead.UserIdList,
                filterLead.FollowUpUserIdList,
                filterLead.GroupId,
                filterLead.FormId,
                filterLead.EmailId,
                filterLead.PhoneNumber,
                filterLead.Name,
                filterLead.LastName,
                filterLead.Address1,
                filterLead.Address2,
                filterLead.StateName,
                filterLead.Country,
                filterLead.ZipCode,
                filterLead.Age,
                filterLead.Gender,
                filterLead.MaritalStatus,
                filterLead.Education,
                filterLead.Occupation,
                filterLead.Interests,
                filterLead.Location,
                filterLead.Religion,
                filterLead.CompanyName,
                filterLead.CompanyWebUrl,
                filterLead.DomainName,
                filterLead.CompanyAddress,
                filterLead.Projects,
                filterLead.LeadLabel,
                filterLead.Remarks,
                filterLead.CustomField1,
                filterLead.CustomField2,
                filterLead.CustomField3,
                filterLead.CustomField4,
                filterLead.CustomField5,
                filterLead.CustomField6,
                filterLead.CustomField7,
                filterLead.CustomField8,
                filterLead.CustomField9,
                filterLead.CustomField10,
                filterLead.CustomField11,
                filterLead.CustomField12,
                filterLead.CustomField13,
                filterLead.CustomField14,
                filterLead.CustomField15,
                filterLead.CustomField16,
                filterLead.CustomField17,
                filterLead.CustomField18,
                filterLead.CustomField19,
                filterLead.CustomField20,
                filterLead.CustomField21,
                filterLead.CustomField22,
                filterLead.CustomField23,
                filterLead.CustomField24,
                filterLead.CustomField25,
                filterLead.CustomField26,
                filterLead.CustomField27,
                filterLead.CustomField28,
                filterLead.CustomField29,
                filterLead.CustomField30,
                filterLead.CustomField31,
                filterLead.CustomField32,
                filterLead.CustomField33,
                filterLead.CustomField34,
                filterLead.CustomField35,
                filterLead.CustomField36,
                filterLead.CustomField37,
                filterLead.CustomField38,
                filterLead.CustomField39,
                filterLead.CustomField40,
                filterLead.CustomField41,
                filterLead.CustomField42,
                filterLead.CustomField43,
                filterLead.CustomField44,
                filterLead.CustomField45,
                filterLead.CustomField46,
                filterLead.CustomField47,
                filterLead.CustomField48,
                filterLead.CustomField49,
                filterLead.CustomField50,
                filterLead.CustomField51,
                filterLead.CustomField52,
                filterLead.CustomField53,
                filterLead.CustomField54,
                filterLead.CustomField55,
                filterLead.CustomField56,
                filterLead.CustomField57,
                filterLead.CustomField58,
                filterLead.CustomField59,
                filterLead.CustomField60,
                filterLead.SearchKeyword,
                filterLead.PageUrl,
                filterLead.ReferrerUrl,
                filterLead.IsAdSenseOrAdWord,
                filterLead.Place,
                filterLead.CityCategory,
                filterLead.CustomField61,
                filterLead.CustomField62,
                filterLead.CustomField63,
                filterLead.CustomField64,
                filterLead.CustomField65,
                filterLead.CustomField66,
                filterLead.CustomField67,
                filterLead.CustomField68,
                filterLead.CustomField69,
                filterLead.CustomField70,
                filterLead.CustomField71,
                filterLead.CustomField72,
                filterLead.CustomField73,
                filterLead.CustomField74,
                filterLead.CustomField75,
                filterLead.CustomField76,
                filterLead.CustomField77,
                filterLead.CustomField78,
                filterLead.CustomField79,
                filterLead.CustomField80,
                filterLead.CustomField81,
                filterLead.CustomField82,
                filterLead.CustomField83,
                filterLead.CustomField84,
                filterLead.CustomField85,
                filterLead.CustomField86,
                filterLead.CustomField87,
                filterLead.CustomField88,
                filterLead.CustomField89,
                filterLead.CustomField90,
                filterLead.CustomField91,
                filterLead.CustomField92,
                filterLead.CustomField93,
                filterLead.CustomField94,
                filterLead.CustomField95,
                filterLead.CustomField96,
                filterLead.CustomField97,
                filterLead.CustomField98,
                filterLead.CustomField99,
                filterLead.CustomField100,
                filterLead.FirstUtmMedium,
                filterLead.FirstUtmCampaign,
                filterLead.FirstUtmTerm,
                filterLead.FirstUtmContent,
                filterLead.UtmTagsList,
                filterLead.UtmTagSource,
                filterLead.IsWhatsAppOptIn
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<List<MLLeadsDetails>> GetLeadsWithContact(LmsCustomReport filterLead, int OffSet, int FetchNext,int publishertype = 0)
        {
            string storeProcCommand = "Lms_CustomReport";
            object? param = new { Action="GET", filterLead.OrderBy,filterLead.StartDate,filterLead.EndDate,filterLead.Score,filterLead.LmsGroupIdList,filterLead.UserIdList,filterLead.FollowUpUserIdList,filterLead.GroupId,filterLead.FormId,filterLead.EmailId,filterLead.PhoneNumber,filterLead.Name,filterLead.LastName,filterLead.Address1,filterLead.Address2,filterLead.StateName,filterLead.Country,filterLead.ZipCode,
                                filterLead.Age,filterLead.Gender,filterLead.MaritalStatus,filterLead.Education,filterLead.Occupation,filterLead.Interests,filterLead.Location,filterLead.Religion,filterLead.CompanyName,filterLead.CompanyWebUrl,filterLead.DomainName,filterLead.CompanyAddress,filterLead.Projects,filterLead.LeadLabel,filterLead.Remarks,
                                filterLead.CustomField1,filterLead.CustomField2,filterLead.CustomField3,filterLead.CustomField4,filterLead.CustomField5,filterLead.CustomField6,filterLead.CustomField7,filterLead.CustomField8,filterLead.CustomField9,filterLead.CustomField10,
                                filterLead.CustomField11,filterLead.CustomField12,filterLead.CustomField13,filterLead.CustomField14,filterLead.CustomField15,filterLead.CustomField16,filterLead.CustomField17,filterLead.CustomField18,filterLead.CustomField19,filterLead.CustomField20,
                                filterLead.CustomField21,filterLead.CustomField22,filterLead.CustomField23,filterLead.CustomField24,filterLead.CustomField25,filterLead.CustomField26,filterLead.CustomField27,filterLead.CustomField28,filterLead.CustomField29,filterLead.CustomField30,
                                filterLead.CustomField31,filterLead.CustomField32,filterLead.CustomField33,filterLead.CustomField34,filterLead.CustomField35,filterLead.CustomField36,filterLead.CustomField37,filterLead.CustomField38,filterLead.CustomField39,filterLead.CustomField40,
                                filterLead.CustomField41,filterLead.CustomField42,filterLead.CustomField43,filterLead.CustomField44,filterLead.CustomField45,filterLead.CustomField46,filterLead.CustomField47,filterLead.CustomField48,filterLead.CustomField49,filterLead.CustomField50,
                                filterLead.CustomField51,filterLead.CustomField52,filterLead.CustomField53,filterLead.CustomField54,filterLead.CustomField55,filterLead.CustomField56,filterLead.CustomField57,filterLead.CustomField58,filterLead.CustomField59,filterLead.CustomField60,
                                filterLead.SearchKeyword,filterLead.PageUrl,filterLead.ReferrerUrl,filterLead.IsAdSenseOrAdWord,filterLead.Place,filterLead.CityCategory, OffSet, FetchNext,filterLead.CustomField61, filterLead.CustomField62, filterLead.CustomField63, filterLead.CustomField64,
                filterLead.CustomField65, filterLead.CustomField66, filterLead.CustomField67, filterLead.CustomField68, filterLead.CustomField69, filterLead.CustomField70,filterLead.CustomField71, filterLead.CustomField72, filterLead.CustomField73, filterLead.CustomField74,
                filterLead.CustomField75, filterLead.CustomField76, filterLead.CustomField77, filterLead.CustomField78, filterLead.CustomField79, filterLead.CustomField80,filterLead.CustomField81, filterLead.CustomField82, filterLead.CustomField83, filterLead.CustomField84,
                filterLead.CustomField85, filterLead.CustomField86, filterLead.CustomField87, filterLead.CustomField88, filterLead.CustomField89, filterLead.CustomField90,filterLead.CustomField91, filterLead.CustomField92, filterLead.CustomField93, filterLead.CustomField94,
                filterLead.CustomField95, filterLead.CustomField96, filterLead.CustomField97, filterLead.CustomField98, filterLead.CustomField99, filterLead.CustomField100 ,filterLead.FirstUtmMedium,filterLead.FirstUtmCampaign,filterLead.FirstUtmTerm,filterLead.FirstUtmContent,filterLead.UtmTagsList,filterLead.UtmTagSource,filterLead.IsWhatsAppOptIn};

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLLeadsDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<MLLeadsDetails?> GetLmsGrpDetailsByContactId(int ContactId, int lmsgroupid)
        {
            string storeProcCommand = "lms_grpdetails_get";
            object? param = new { ContactId, lmsgroupid };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLLeadsDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }
        public async Task<List<FormDetails>> GetAllForms()
        {
            string storeProcCommand = "Lms_CustomReport";
            object? param = new { Action = "GetAllForms" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FormDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

            
        }

        
        public async Task<List<MLContact>> GetLeadsHistoryReport(string action, List<int> contact, string FromDate, string ToDate)
        {
            string storeProcCommand = "Lms_HistoryReport";
            object? param = new { action, ContactIdList=contact.Count > 0 ? string.Join(",", contact) : "", FromDate, ToDate };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLContact>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }
        public async Task<bool> Getheaderflag()
        {
            string storeProcCommand = "Lms_HeaderFlag";
            object? param = new { Action = "Get"};

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
