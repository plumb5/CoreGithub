﻿using Dapper;
using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
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
    public partial class DLContactPG:IDLContact
    {
        public async Task<bool> UpdateLeadLabel(int LmsGroupMembersId, string LabelValue, int LMSGroupId)
        {
            string storeProcCommand = "select contact_details_lms_updateleadlabel( @LmsGroupMembersId, @LabelValue, @LMSGroupId)";
            object? param = new { LmsGroupMembersId, LabelValue, LMSGroupId };
            using var db = GetDbConnection(connection.Connection);
            return  await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateFollowUpByContactId(int LmsGroupmembersIds, string FollowUpContent, Int16 FollowUpStatus, DateTime FollowUpdate, int FollowUpUserId, int LmsGroupIds)
        {
            string storeProcCommand = "select contact_details_lms_updatefollowups(@LmsGroupmembersIds, @FollowUpContent, @FollowUpStatus, @FollowUpdate, @FollowUpUserId, @LmsGroupIds)";
            object? param = new { LmsGroupmembersIds, FollowUpContent, FollowUpStatus, FollowUpdate, FollowUpUserId, LmsGroupIds };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<IEnumerable<MLLmsLeadNotInteractedDetails>> GetContactInactiveNotification()
        {
            string storeProcCommand = "select * from contact_details_lms_getinactivecontacts()";
            object? param = new { };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLLmsLeadNotInteractedDetails>(storeProcCommand);
        }

        public async Task<MLContact?> GetLeadFollowUpData(int LmsGroupmemberId)
        {
            string storeProcCommand = "select * from  contact_details_lms_getleadfollowupdata(@LmsGroupmemberId)";
            object? param = new { LmsGroupmemberId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLContact?>(storeProcCommand, param);


        }

        public async Task<bool> UpdateFollowUpCompleted(int LmsGroupmemberIds)
        {
            string storeProcCommand = "select contact_details_lms_updatefollowupcompleted(@LmsGroupmemberIds)";

            object? param = new { LmsGroupmemberIds };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateStage(MLContact contact)
        {
            string storeProcCommand = "select contact_details_lms_updatestage(@ContactId, @Score, @UserInfoUserId, @Revenue, @ClouserDate, @LmsGroupmemberId )";
            object? param = new { contact.ContactId, contact.Score, contact.UserInfoUserId, contact.Revenue, contact.ClouserDate, contact.LmsGroupmemberId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<MLContact?> GetLeadsWithContact(int ContactId, int LmsGroupMemberId)
        {
            string storeProcCommand = "select * from contact_details_lms_getindividuallead( @ContactId, @LmsGroupMemberId)";
            object? param = new { ContactId, LmsGroupMemberId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLContact?>(storeProcCommand, param);
        }

        public async Task<MLContact?> GetLeadsByContactId(int ContactId)
        {
            string storeProcCommand = "select * from contact_details_lms_getleadsbycontactid(@ContactId)";
            object? param = new { ContactId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLContact?>(storeProcCommand, param);
        }

        public async Task<IEnumerable<MLContact>> GetLeadsByContactIdList(List<int> ContactIdList)
        {
            string ContactIdLists= string.Join(",", ContactIdList);
            string storeProcCommand = "select * from contact_details_lms_getleadsbycontactidlist(@ContactIdLists)";
            object? param = new { ContactIdLists };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<MLContact>(storeProcCommand, param);
        }

        public async Task<bool> DeleteLead(int LmsGroupMemberId)
        {
            string storeProcCommand = "select * from contact_details_lms_deletelead(@LmsGroupMemberId)";
            object? param = new { LmsGroupMemberId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> AssignSalesPerson(int ContactId, int UserInfoUserId, int LmsGroupMemberId = 0)
        {
            string storeProcCommand = "select * from contact_details_lms_changesalesperson(@ContactId, @UserInfoUserId, @LmsGroupMemberId)";
            object? param = new { ContactId, UserInfoUserId, LmsGroupMemberId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<Int32> CheckEmailIdExists(string EmailId)
        {
            string storeProcCommand = "select * from contact_details_lms_checkcontactdetailsexistsbymail(@EmailId)";
            object? param = new { EmailId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<Int32> CheckPhoneNumberExists(string PhoneNumber)
        {
            string storeProcCommand = "select * from contact_details_lms_checkcontactdetailsexistsbyphone(@PhoneNumber)";
            object? param = new { PhoneNumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }


        public async Task<bool> UpdateLeadSeen(int ContactId)
        {
            string storeProcCommand = "select * from contact_details_updateleadseen(@ContactId)";
            object? param = new { ContactId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateLmsRemainder(Contact contact, int LmsGroupmembersId, string ToReminderWhatsAppPhoneNumber = null)
        {
            try
            {
                string storeProcCommand = "select * from contact_details_lms_updatereminder( @ContactId, @ToReminderEmailId, @ToReminderPhoneNumber, @ReminderDate, @UserInfoUserId, @LmsGroupId, @Score, @LeadLabel, @LmsGroupmembersId, @ToReminderWhatsAppPhoneNumber)";
                object? param = new { contact.ContactId, contact.ToReminderEmailId, contact.ToReminderPhoneNumber, contact.ReminderDate, contact.UserInfoUserId, contact.LmsGroupId, contact.Score, contact.LeadLabel, LmsGroupmembersId, ToReminderWhatsAppPhoneNumber };
                using var db = GetDbConnection(connection.Connection);
                return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
            }
            catch (Exception ex)
            {
                throw new Exception();
            }
        }

        public async Task<bool> UpdateRepeatLead(int ContactId)
        {
            string storeProcCommand = "select * from contact_details_lms_updaterepeatlead(@ContactId)";
            object? param = new { ContactId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<Int32> MaxCountMasterFilter(Contact contact, int OffSet, int FetchNext, int UserInfoUserId, int UserGroupId, int filteredgroupid, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime)
        {
            List<Contact> contactObject = new List<Contact>();
            contactObject.Add(contact);
            DataTable contacts = new DataTable();
            contacts = ToDataTables(contactObject);
            TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
            foreach (DataColumn column in contacts.Columns)
                column.ColumnName = ti.ToLower(column.ColumnName);

            string storeProcCommand = "select * from contact_new_details_maxcount(@UserInfoUserId, @UserGroupId, @OffSet, @FetchNext, @FromDateTime, @ToDateTime, @filteredgroupid, @contacts)";
            object? param = new { UserInfoUserId, UserGroupId, OffSet, FetchNext, FromDateTime, ToDateTime, filteredgroupid, contacts = new JsonParameter(JsonConvert.SerializeObject(contacts)) };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<IEnumerable<Contact>> GetCustomContactDetails(Contact filterLead, int OffSet, int FetchNext, int userInfoUserId, int userGroupId, int groupid, Nullable<DateTime> FromDate, Nullable<DateTime> ToDate, List<string> fieldsName)
        {
            List<Contact> contactObject = new List<Contact>();
            contactObject.Add(filterLead);
            DataTable contacts = new DataTable();
            contacts = ToDataTables(contactObject);
            TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
            foreach (DataColumn column in contacts.Columns)
                column.ColumnName = ti.ToLower(column.ColumnName);

            string storeProcCommand = "select * from contact_new_details_get(@userInfoUserId, @userGroupId, @OffSet, @FetchNext, @FromDate, @ToDate, @groupid, @contacts)";
            object? param = new { userInfoUserId, userGroupId, OffSet, FetchNext, FromDate, ToDate, groupid, contacts = new JsonParameter(JsonConvert.SerializeObject(contacts)) };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Contact>(storeProcCommand, param);
        }

        public async Task<bool> UpdateLmsGroupId(int ContactId, int LmsGroupId)
        {
            string storeProcCommand = "select contact_details_updatelmsgrpid(@ContactId, @LmsGroupId)";
            object? param = new { ContactId, LmsGroupId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> UpdateUserInfoUserId(int ContactId, int UserInfoUserId)
        {
            string storeProcCommand = "select contact_details_updateuserinfouserid(@ContactId, @UserInfoUserId)";
            object? param = new { ContactId, UserInfoUserId };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
    }
}

