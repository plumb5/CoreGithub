using Dapper;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public partial class DLContactSQL: IDLContact
    {
        public async Task<bool> UpdateLeadLabel(int LmsGroupMembersId, string LabelValue, int LMSGroupId)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new {Action= "UpdateLeadLabel", LmsGroupMembersId, LabelValue, LMSGroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)> 0;
        }

        public async Task<bool> UpdateFollowUpByContactId(int LmsGroupmembersIds, string FollowUpContent, Int16 FollowUpStatus, DateTime FollowUpdate, int FollowUpUserId, int LmsGroupIds)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "UpdateFollowUps", LmsGroupmembersIds, FollowUpContent, FollowUpStatus, FollowUpdate, FollowUpUserId, LmsGroupIds };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<IEnumerable<MLLmsLeadNotInteractedDetails>> GetContactInactiveNotification()
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "GetInactiveContacts" };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLLmsLeadNotInteractedDetails>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<MLContact?> GetLeadFollowUpData(int LmsGroupmemberId)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "GetLeadFollowUpData", LmsGroupmemberId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLContact?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
              
        }

        public async Task<bool> UpdateFollowUpCompleted(int LmsGroupmemberIds)
        {
            string storeProcCommand = "Contact_Details_LMS";

            object? param = new { Action = "UpdateFollowUpCompleted", LmsGroupmemberIds };
            using var db = GetDbConnection(connection.Connection); 
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateStage(MLContact contact)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "UpdateStage", contact.ContactId, contact.Score, contact.UserInfoUserId, contact.Revenue, contact.ClouserDate, contact.LmsGroupmemberId };

            using var db = GetDbConnection(connection.Connection); 
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<MLContact?> GetLeadsWithContact(int ContactId, int LmsGroupMemberId)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "GetIndividualLead", ContactId, LmsGroupMemberId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLContact?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<MLContact?> GetLeadsByContactId(int ContactId)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "GetLeadsByContactId", ContactId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLContact?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<IEnumerable<MLContact>> GetLeadsByContactIdList(List<int> ContactIdList)
        {
            string ContactIdLists = string.Join(",", ContactIdList);
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "GetLeadsByContactIdList", ContactIdLists };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLContact>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<bool> DeleteLead(int LmsGroupMemberId)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "DeleteLead", LmsGroupMemberId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> AssignSalesPerson(int ContactId, int UserInfoUserId, int LmsGroupMemberId = 0)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "ChangeSalesPerson", ContactId, UserInfoUserId, LmsGroupMemberId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<Int32> CheckEmailIdExists(string EmailId)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "CheckContactDetailsExists", EmailId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }

        public async Task<Int32> CheckPhoneNumberExists(string PhoneNumber)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "CheckContactDetailsExists", PhoneNumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

        }


        public async Task<bool> UpdateLeadSeen(int ContactId)
        {
            string storeProcCommand = "Contact_Details"; 
            object? param = new { Action = "UpdateLeadSeen", ContactId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateLmsRemainder(Contact contact, int LmsGroupmembersId, string ToReminderWhatsAppPhoneNumber = null)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "UpdateReminder", contact.ContactId, contact.ToReminderEmailId, contact.ToReminderPhoneNumber, contact.ReminderDate, contact.UserInfoUserId, contact.LmsGroupId, contact.Score, contact.LeadLabel, LmsGroupmembersId, ToReminderWhatsAppPhoneNumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateRepeatLead(int ContactId)
        {
            string storeProcCommand = "Contact_Details_LMS";
            object? param = new { Action = "UpdateRepeatLead", ContactId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<Int32> MaxCountMasterFilter(Contact contact, int OffSet, int FetchNext, int UserInfoUserId, int UserGroupId, int filteredgroupid, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime)
        {
             
            string storeProcCommand = "Contact_New_Details";
            object? param = new
            {
                Action="Maxcount",
                FromDateTime,
                ToDateTime,
                filteredgroupid,
                contact.FormId,
                contact.EmailId,
                contact.PhoneNumber,
                contact.Name,
                contact.LastName,
                contact.Address1,
                contact.Address2,
                contact.StateName,
                contact.Country,
                contact.ZipCode,
                contact.Age,
                contact.Gender,
                contact.MaritalStatus,
                contact.Education,
                contact.Occupation,
                contact.Interests,
                contact.Location,
                contact.Religion,
                contact.CompanyName,
                contact.CompanyWebUrl,
                contact.DomainName,
                contact.CompanyAddress,
                contact.Projects,
                contact.LeadLabel,
                contact.Remarks,
                contact.CustomField1,
                contact.CustomField2,
                contact.CustomField3,
                contact.CustomField4,
                contact.CustomField5,
                contact.CustomField6,
                contact.CustomField7,
                contact.CustomField8,
                contact.CustomField9,
                contact.CustomField10,
                contact.CustomField11,
                contact.CustomField12,
                contact.CustomField13,
                contact.CustomField14,
                contact.CustomField15,
                contact.CustomField16,
                contact.CustomField17,
                contact.CustomField18,
                contact.CustomField19,
                contact.CustomField20,
                contact.CustomField21,
                contact.CustomField22,
                contact.CustomField23,
                contact.CustomField24,
                contact.CustomField25,
                contact.CustomField26,
                contact.CustomField27,
                contact.CustomField28,
                contact.CustomField29,
                contact.CustomField30,
                contact.CustomField31,
                contact.CustomField32,
                contact.CustomField33,
                contact.CustomField34,
                contact.CustomField35,
                contact.CustomField36,
                contact.CustomField37,
                contact.CustomField38,
                contact.CustomField39,
                contact.CustomField40,
                contact.CustomField41,
                contact.CustomField42,
                contact.CustomField43,
                contact.CustomField44,
                contact.CustomField45,
                contact.CustomField46,
                contact.CustomField47,
                contact.CustomField48,
                contact.CustomField49,
                contact.CustomField50,
                contact.CustomField51,
                contact.CustomField52,
                contact.CustomField53,
                contact.CustomField54,
                contact.CustomField55,
                contact.CustomField56,
                contact.CustomField57,
                contact.CustomField58,
                contact.CustomField59,
                contact.CustomField60,
                contact.SearchKeyword,
                contact.PageUrl,
                contact.ReferrerUrl,
                contact.IsAdSenseOrAdWord,
                contact.Place,
                contact.CityCategory,
                OffSet,
                FetchNext,
                contact.CustomField61,
                contact.CustomField62,
                contact.CustomField63,
                contact.CustomField64,
                contact.CustomField65,
                contact.CustomField66,
                contact.CustomField67,
                contact.CustomField68,
                contact.CustomField69,
                contact.CustomField70,
                contact.CustomField71,
                contact.CustomField72,
                contact.CustomField73,
                contact.CustomField74,
                contact.CustomField75,
                contact.CustomField76,
                contact.CustomField77,
                contact.CustomField78,
                contact.CustomField79,
                contact.CustomField80,
                contact.CustomField81,
                contact.CustomField82,
                contact.CustomField83,
                contact.CustomField84,
                contact.CustomField85,
                contact.CustomField86,
                contact.CustomField87,
                contact.CustomField88,
                contact.CustomField89,
                contact.CustomField90,
                contact.CustomField91,
                contact.CustomField92,
                contact.CustomField93,
                contact.CustomField94,
                contact.CustomField95,
                contact.CustomField96,
                contact.CustomField97,
                contact.CustomField98,
                contact.CustomField99,
                contact.CustomField100,
                contact.IsWhatsAppOptIn,
                contact.FirstUtmMedium,
                contact.FirstUtmCampaign,
                contact.FirstUtmTerm,
                contact.FirstUtmContent,
                contact.UtmTagsList,
                contact.UtmTagSource
            };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);  
        }

        public async Task<IEnumerable<Contact>> GetCustomContactDetails(Contact filterLead, int OffSet, int FetchNext, int userInfoUserId, int userGroupId, int groupid, Nullable<DateTime> FromDate, Nullable<DateTime> ToDate, List<string> fieldsName)
        {
            
            string storeProcCommand = "Contact_New_Details";
            object? param = new {
                Action="GET",
                FromDate,
                ToDate,
                groupid,
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
                OffSet,
                FetchNext,
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
                filterLead.IsWhatsAppOptIn,
                filterLead.FirstUtmMedium,
                filterLead.FirstUtmCampaign,
                filterLead.FirstUtmTerm,
                filterLead.FirstUtmContent,
                filterLead.UtmTagsList,
                filterLead.UtmTagSource
            };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Contact>(storeProcCommand, param, commandType: CommandType.StoredProcedure); 
        }

        public async Task<bool> UpdateLmsGroupId(int ContactId, int LmsGroupId)
        {
            string storeProcCommand = "Contact_Details";
            object? param = new { Action="UpdateLmsGrpID",ContactId, LmsGroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> UpdateUserInfoUserId(int ContactId, int UserInfoUserId)
        {
            string storeProcCommand = "Contact_Details";
            object? param = new { Action = "UpdateUserInfoUserId", ContactId, UserInfoUserId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }
    }
}

