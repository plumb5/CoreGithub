using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLContact : IDisposable
    {
        Task<Int32> Save(Contact contact, ContactMergeConfiguration? mergeConfiguration = null);
        Task<bool> Update(Contact contact, ContactMergeConfiguration? mergeConfiguration = null);
        Task<IEnumerable<Contact>> GET(Contact contact, int FetchNext, int OffSetFetchIndex, int AgeRange1, int AgeRange2, string ContactListOfId, List<string> fieldName = null, bool? IsPhoneContact = null, int GroupId = 0);
        Task<Contact?> GetDetails(Contact contact, List<string> fieldName = null, bool IsPhoneContact = false);
        Task<IEnumerable<Contact>> GetContactIds(List<Contact> contact, int OffSet, int FetchNext, List<string> fieldName, bool IsPhoneContact = false);
        Task<Contact?> GetContactDetails(Contact contact, List<string> fieldName = null);
        Task<List<Contact>> GetAllContactList(List<int> ContactIds, bool IsPhoneContact = false);
        Task<IEnumerable<Groups>> BelongToWhichGroup(int ContactId);
        Task<bool> UpdateVerification(int ContactId, int IsVerifiedMailId);
        Task<IEnumerable<MLContacts>> GetContactForVerification(int GroupId);
        Task<bool> SearchAndAddtoGroup(int UserInfoUserId, int UserGroupId, Contact contact, int StartCount, int EndCount, int GroupId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime);
        Task<bool> AddToUnsubscribeList(int[] contact);
        Task<bool> AddToSmsUnsubscribeList(int[] contact);
        Task<bool> AddToInvalidateList(int[] contact);
        Task<bool> SmsUnSubscribe(string PhoneNumber);
        List<Contact> GetListByContactIdTable(DataTable CampaignContactId, List<string> fieldNames);
        Task<Int32> MaxCount(Contact contact, Int32? GroupId = null);
        Task<IEnumerable<Contact>> GetAllContact(Contact contact, int FetchNext, int OffSet, Int32? GroupId = null, List<string> fieldsName = null);
        Task<Contact?> GetContactDetailsByEmailIdPhoneNumber(Contact contact);
        Task<IEnumerable<Contact>> CheckEmailOrPhoneExistence(string EmailId, string PhoneNumber, List<string> FieldNames);
        Task<Int32> FacebookContactsMaxCount(Contact contact, Int32? GroupId = null);
        Task<IEnumerable<Contact>> FacebookContactDetails(Contact contact, int FetchNext, int OffSet, Int32? GroupId = null, List<string> fieldsName = null);
        Task<bool> MakeItNotVerified(int ContactId, int IsVerifiedMailId);
        Task<Int32> CheckEmailIdPhoeNumberExists(string EmailId, string PhoneNumber);
        Task<Contact?> GetContactDetailsAsync(Contact contact, List<string> fieldName = null);
        Task<bool> UpdateVerificationAsync(int ContactId, int IsVerifiedMailId);
        Task<bool> UpdateIsVerifiedMailId(int GroupId);
        Task<Int32> MailUnSubscribeMaxCount(int GroupId);
        Task<IEnumerable<Contact>> GetMailUnSubscribeDetails(int OffSet, int FetchNext, int GroupId);
        Task<bool> UpdateMailUnSubscribedContact(int contactid);
        Task<bool> UpdateLeadLabel(int LmsGroupMembersId, string LabelValue, int LMSGroupId);
        Task<bool> UpdateFollowUpByContactId(int LmsGroupmembersIds, string FollowUpContent, Int16 FollowUpStatus, DateTime FollowUpdate, int FollowUpUserId, int LmsGroupIds);
        Task<IEnumerable<MLLmsLeadNotInteractedDetails>> GetContactInactiveNotification();
        Task<MLContact?> GetLeadFollowUpData(int LmsGroupmemberId);
        Task<bool> UpdateFollowUpCompleted(int LmsGroupmemberIds);
        Task<bool> UpdateStage(MLContact contact);
        Task<MLContact?> GetLeadsWithContact(int ContactId, int LmsGroupMemberId);
        Task<MLContact?> GetLeadsByContactId(int ContactId);
        Task<IEnumerable<MLContact>> GetLeadsByContactIdList(List<int> ContactIdList);
        Task<bool> DeleteLead(int LmsGroupMemberId);
        Task<bool> AssignSalesPerson(int ContactId, int UserInfoUserId, int LmsGroupMemberId = 0);
        Task<Int32> CheckEmailIdExists(string EmailId);
        Task<Int32> CheckPhoneNumberExists(string PhoneNumber);
        Task<bool> UpdateLeadSeen(int ContactId);
        Task<bool> UpdateLmsRemainder(Contact contact, int LmsGroupmembersId, string ToReminderWhatsAppPhoneNumber = null);
        Task<bool> UpdateRepeatLead(int ContactId);
        Task<Int32> MaxCountMasterFilter(Contact contact, int OffSet, int FetchNext, int UserInfoUserId, int UserGroupId, int filteredgroupid, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime);
        Task<IEnumerable<Contact>> GetCustomContactDetails(Contact filterLead, int OffSet, int FetchNext, int userInfoUserId, int userGroupId, int groupid, Nullable<DateTime> FromDate, Nullable<DateTime> ToDate, List<string> fieldsName);
        Task<bool> UpdateLmsGroupId(int ContactId, int LmsGroupId);
        Task<bool> UpdateUserInfoUserId(int ContactId, int UserInfoUserId);
    }
}
